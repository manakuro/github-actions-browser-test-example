import * as child_process from "child_process";
import consola from 'consola'

const spawn = (command: string) => {
  const [c, ...args] = command.split(' ')
  if (process.platform.startsWith('win')) {
    return child_process.spawn('cmd', ['/s', '/c', c, ...args])
  } else {
    return child_process.spawn(c, args)
  }
}

const serve = () => {
  const served = spawn('yarn serve')
  served.stdout.on('data', (data) => {
    consola.log(`${data}`)
  })
  served.stderr.on('data', (data) => {
    consola.error(`${data}`)
  })
  served.on('close', (code) => {
    consola.info(`${code}`)
  })

  return served
}

const build = () => {
  const result = child_process.execSync(`yarn build`)
  consola.success(`${result}`)
}

const run = (served: child_process.ChildProcessWithoutNullStreams) => {
  const command = process.platform.startsWith('win') ?
  `yarn test:windows` :
  `yarn test:macos`

  const e2e = spawn(command)
  e2e.stdout.on('data', (data) => {
    consola.log(`${data}`)
  })
  e2e.stderr.on('data', (data) => {
    consola.error(`${data}`)
  })
  e2e.on('close', (code) => {
    served.kill()
    process.exit(code)
  })
}

build()
const served = serve()
run(served)




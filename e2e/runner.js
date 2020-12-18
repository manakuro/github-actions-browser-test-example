import * as child_process from "child_process";
import consola from 'consola'

const spawn = (command) => {
  const [c, ...args] = command.split(' ')
  if (process.platform.startsWith('win')) {
    return child_process.spawn('cmd', ['/s', '/c', c, ...args])
  } else {
    return child_process.spawn(c, args)
  }
}

const build = child_process.execSync(`yarn build`)
consola.success(`Build: ${build}`)

const start = spawn('yarn serve')
start.stdout.on('data', (data) => {
  consola.log(`${data}`)
})
start.stderr.on('data', (data) => {
  consola.error(`${data}`)
})
start.on('close', (code) => {
  consola.info(`${code}`)
})

const e2e = spawn(
  `npx testcafe ${process.env.BROWSER} e2e/**/*.spec.js --hostname localhost`
)
e2e.stdout.on('data', (data) => {
  consola.log(`${data}`)
})
e2e.stderr.on('data', (data) => {
  consola.error(`${data}`)
})
e2e.on('close', (code) => {
  start.kill()
  process.exit(code)
})

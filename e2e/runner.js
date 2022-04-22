import * as child_process from "child_process";
import consola from "consola";
import crossSpawn from "cross-spawn";

const spawn = (command, options) => {
  const [c, ...args] = command.split(" ");
  return crossSpawn(c, args, options);
};

const serve = () => {
  const served = spawn("yarn serve");
  served.stdout.on("data", (data) => {
    consola.log(`${data}`);
  });
  served.stderr.on("data", (data) => {
    consola.error(`${data}`);
  });
  served.on("close", (code) => {
    consola.info(`${code}`);
  });

  return served;
};

const build = () => {
  const result = child_process.execSync(`yarn build`);
  consola.success(`${result}`);
};

const run = (served) => {
  const command = `yarn test:macos`;

  const e2e = spawn(command, { stdio: "inherit" });
  e2e.stdout.on("data", (data) => {
    consola.log(`${data}`);
  });
  e2e.stderr.on("data", (data) => {
    consola.error(`${data}`);
  });

  e2e.on("close", (data) => {
    served.kill();
    consola.log(`CLOSE: ${data}`);
    process.exit(data);
  });
};

build();
const served = serve();
run(served);

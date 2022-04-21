import * as child_process from "child_process";
import consola from "consola";
import crossSpawn from "cross-spawn";

const spawn = (command) => {
  const [c, ...args] = command.split(" ");
  return crossSpawn(c, args);
};

const serve = () => {
  const served = spawn("yarn serve");
  served.stdout.on("data", (data) => {
    consola.log(`SERVE_OUT: ${data}`);
  });
  served.stderr.on("data", (data) => {
    consola.error(`SERVE_ERROR: ${data}`);
  });
  served.on("close", (code) => {
    consola.info(`SERVE_CLOSE: ${code}`);
  });

  return served;
};

const build = () => {
  const result = child_process.execSync(`yarn build`);
  consola.success(`${result}`);
};

const run = (served) => {
  const command = `yarn test:macos`;

  const e2e = spawn(command);
  e2e.stdout.on("data", (data) => {
    if (data.indexOf("CONNECTED") >= 0) {
      console.log("remove");
      spawn("rm -rf ~/.testcafe-browser-tools");
    }
    consola.log(`OUT: ${data}`);
  });
  e2e.stderr.on("data", (data) => {
    consola.error(`ERR: ${data}`);
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

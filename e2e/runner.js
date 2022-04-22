import * as child_process from "child_process";
import consola from "consola";

const serve = () => {
  const served = child_process.spawn("yarn serve");
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

  const e2e = child_process.spawn(command);
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

import * as child_process from "child_process";
import consola from "consola";
import crossSpawn from "cross-spawn";

const spawn = (command: string) => {
  const [c, ...args] = command.split(" ");
  return crossSpawn(c, args) as child_process.ChildProcessWithoutNullStreams;
};

const serve = () => {
  const served = spawn("yarn start");
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

const run = (served: child_process.ChildProcessWithoutNullStreams) => {
  const command = process.platform.startsWith("win")
    ? `npx testcafe ${process.env.BROWSER} e2e/**/*.spec.{js,ts} --hostname localhost`
    : `yarn test:macos`;

  const e2e = spawn(command);
  e2e.stdout.on("data", (data) => {
    consola.log(`${data}`);
  });
  e2e.stderr.on("data", (data) => {
    consola.error(`${data}`);
  });
  e2e.on("close", () => {
    served.kill();
    process.exit(0);
  });
};

// build();
const served = serve();
run(served);

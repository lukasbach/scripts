import { execaCommand } from "execa";
import deepmerge from "deepmerge";

export const getPackageRoot = async () => {
  const root = await utils.goUpTree((dir) => fs.exists(path.join(dir, "package.json")));
  if (!root) {
    log.exit("Could not find package.json");
    process.exit(1);
  }
  log.verbose(`Resolved node package root to ${root}`);
  return root;
};

export const getPackageJson = async () => {
  return fs.readJSON(path.join(await getPackageRoot(), "package.json"), "utf-8");
};

export const getTsconfig = async () => {
  return fs.readJSON(path.join(await getPackageRoot(), "tsconfig.json"), "utf-8");
};

export const amendPackageJson = async (amend: object) => {
  log.muted(`Amending package.json`);
  const newValue = deepmerge.all([await getPackageJson(), amend]);
  await fs.writeJson(path.join(await getPackageRoot(), "package.json"), newValue, { spaces: 2 });
};

export const amendTsconfig = async (amend: object) => {
  log.muted(`Amending tsconfig.json`);
  const newValue = deepmerge.all([await getTsconfig(), amend]);
  await fs.writeJson(path.join(await getPackageRoot(), "tsconfig.json"), newValue, { spaces: 2 });
};

export const getPackageManager = async () => {
  const root = await getPackageRoot();
  if (await fs.exists(path.join(root, "yarn.lock"))) {
    log.verbose("Found yarn.lock, assuming yarn as package manager");
    return "yarn";
  }
  if (await fs.exists(path.join(root, "pnpm-lock.yaml"))) {
    log.verbose("Found pnpm-lock.yaml, assuming pnpm as package manager");
    return "pnpm";
  }
  log.verbose("Found no pnpm-lock.yaml or yarn.lock, assuming npm as package manager");
  return "npm";
};

export const addDependency = async (installName: string) => {
  const pm = await getPackageManager();
  const scripts = {
    npm: `npm install ${installName}`,
    yarn: `yarn add ${installName}`,
    pnpm: `pnpm add ${installName}`,
  };
  log.muted(`Adding dependency ${installName}`);
  await execaCommand(scripts[pm], { cwd: await getPackageRoot() });
};

export const addDevDependency = async (installName: string) => {
  const pm = await getPackageManager();
  const scripts = {
    npm: `npm install ${installName} --save-dev`,
    yarn: `yarn add ${installName} --dev`,
    pnpm: `pnpm add ${installName} --save-dev`,
  };
  log.muted(`Adding dev dependency ${installName}`);
  await execaCommand(scripts[pm], { cwd: await getPackageRoot() });
};

export const runScript = async (scriptName: string) => {
  const pm = await getPackageManager();
  const scripts = {
    npm: `npm run ${scriptName}`,
    yarn: `yarn run ${scriptName}`,
    pnpm: `pnpm run ${scriptName}`,
  };
  log.muted(`Running script ${scriptName}`);
  await execaCommand(scripts[pm], { cwd: await getPackageRoot() });
};

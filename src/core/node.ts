export const getPackageRoot = async () => {
  const root = await utils.goUpTree((dir) => fs.exists(path.join(dir, "package.json")));
  if (!root) {
    throw new Error("Could not find package.json");
  }
  return root;
};

export const getPackageJson = async () => {
  return fs.readJson(path.join(await getPackageRoot(), "package.json"), "utf-8");
};

export const amendPackageJson = async (amend: object) => {
  const newValue = { ...(await getPackageJson()), ...amend };
  await fs.writeJson(path.join(await getPackageRoot(), "package.json"), newValue, { spaces: 2 });
};

export const getPackageManager = async () => {
  const root = await getPackageRoot();
  if (await fs.exists(path.join(root, "yarn.lock"))) {
    return "yarn";
  }
  if (await fs.exists(path.join(root, "pnpm-lock.yaml"))) {
    return "pnpm";
  }
  return "npm";
};

export const addDependency = async (installName: string) => {
  const pm = await getPackageManager();
  const scripts = {
    npm: `npm install ${installName}`,
    yarn: `yarn add ${installName}`,
    pnpm: `pnpm add ${installName}`,
  };
  await $({ cwd: await getPackageRoot() })`${scripts[pm]}`;
};

export const addDevDependency = async (installName: string) => {
  const pm = await getPackageManager();
  const scripts = {
    npm: `npm install ${installName} --save-dev`,
    yarn: `yarn add ${installName} --dev`,
    pnpm: `pnpm add ${installName} --save-dev`,
  };
  await $({ cwd: await getPackageRoot() })`${scripts[pm]}`;
};

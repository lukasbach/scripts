/** Configures the .yarnrc.yml file to use the node-modules linker, and adds the necessary items to .gitignore. */

const packageRoot = await utils.node.getPackageRoot();

const gitignore = `${(await fs.readFile(path.join(packageRoot, ".gitignore"), "utf-8")) ?? ""}
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
node_modules
yarn-error.log\n`;

await fs.remove(path.join(packageRoot, "package-lock.json"));
await fs.writeFile(path.join(packageRoot, ".yarnrc.yml"), "nodeLinker: node-modules\n");
await fs.writeFile(path.join(packageRoot, ".gitignore"), gitignore);
await $({ cwd: packageRoot })`yarn`;

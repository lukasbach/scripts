/** Scaffolds a new React app with Vite. */

const projectName = await ask.text("_", "What is the name of the project?", "my-app");

await $`yarn create vite ${projectName} --template react-ts`;
await utils.cd(projectName);

if (fs.existsSync("package-lock.json")) {
  await fs.remove("package-lock.json");
}

await utils.runScript("node/yarn-nodemodules");
await utils.runScript("node/volta");

if (await ask.confirm("Do you want to use eslint with my default config?")) {
  await utils.node.removeDependencies("eslint-plugin-react-hooks eslint-plugin-react-refresh");
  await fs.unlink("eslint.config.js");

  await utils.runScript("node/setup-eslint", { rule: "@lukasbach/base/react" });
}

await utils.node.amendPackageJson({
  scripts: { start: "vite" },
});

await utils.runScript("github/setup-node-verify-action");
await utils.runScript("node/normalize-package-json");

if (await ask.bool("git", "Do you want to initialize a github repository?")) {
  await utils.runScript("github/create-from-local");
}

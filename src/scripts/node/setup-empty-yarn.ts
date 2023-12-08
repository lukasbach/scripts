/** Creates a new empty yarn repository. */

const projectPath = await ask.text("path", "Where do you want to create the project?", process.cwd());
await utils.cd(projectPath);
await fs.writeJSON(
  "package.json",
  {
    name: projectPath.replaceAll("\\", "/").split("/").pop(),
    version: "0.0.0",
    private: true,
    scripts: {},
  },
  { spaces: 2 }
);

await utils.runScript("node/yarn-nodemodules");
await utils.runScript("node/configure-npm-repo");
await $`git init`;

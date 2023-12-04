import inquirer from "inquirer";

if (!(await fs.exists(utils.getShortcutsFile()))) {
  if (!(await ask.confirm(`Shortcuts config file ${utils.getShortcutsFile()} doesn't exist yet, create it?`))) {
    log.exit("Aborting");
  }

  await fs.writeJson(
    utils.getShortcutsFile(),
    {
      fc: "react/fc",
      fcp: "react/fcprops",
      forwardref: "react/forwardref",
      "package-setup": "node/yarn-nodemodules, node/configure-npm-repo, node/volta, node/setup-eslint",
    },
    { spaces: 2 }
  );
}

const { shortcuts } = await inquirer.prompt({
  type: "editor",
  name: "shortcuts",
  message: "Edit shortcuts:",
  default: await fs.readFile(utils.getShortcutsFile(), "utf8"),
});

await fs.writeJSON(utils.getShortcutsFile(), JSON.parse(shortcuts), { spaces: 2 });

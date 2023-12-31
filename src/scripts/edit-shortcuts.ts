/**
 * Edit shortcuts for any scripts supported by @lukasbach/scripts that can later be used instead of
 * the full script name. If the shortcuts file doesn't exist yet, it will be offered to be created.
 */

import inquirer from "inquirer";
import { defaultShortcuts } from "../core/shortcuts.js";

if (!(await fs.exists(utils.getShortcutsFile()))) {
  if (!(await ask.confirm(`Shortcuts config file ${utils.getShortcutsFile()} doesn't exist yet, create it?`))) {
    log.exit("Aborting");
  }

  await fs.writeJson(utils.getShortcutsFile(), defaultShortcuts, { spaces: 2 });
}

const { shortcuts } = await inquirer.prompt({
  type: "editor",
  name: "shortcuts",
  message: "Edit shortcuts:",
  default: await fs.readFile(utils.getShortcutsFile(), "utf8"),
});

await fs.writeJSON(utils.getShortcutsFile(), JSON.parse(shortcuts), { spaces: 2 });

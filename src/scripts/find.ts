/** Search a script by name */
import { getScriptPaths, resolveScriptData } from "./internal/utils.js";

const scripts = Object.values(await resolveScriptData(await getScriptPaths())).filter((s) => !s.isInternal);

const found = await ask.choice(
  "script",
  "Search for a script:",
  scripts.map((s) => s.command)
);

if (!found) {
  process.exit(0);
}

await utils.runScript(found);

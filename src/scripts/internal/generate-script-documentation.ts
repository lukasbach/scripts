/** @internal */

import * as path from "path";
import { getScriptPaths, resolveScriptData } from "./utils.js";
import { getScriptPageMd, getShortcutsMd } from "./web-utils.js";

const scriptData = await resolveScriptData(await getScriptPaths());
const target = await ask.text("dest,d", "Where should the documentation be stored?", "./docs");
await fs.ensureDir(target);
const scriptList: string[] = [];

for (const script of Object.keys(scriptData)) {
  const data = scriptData[script];
  if (data.isInternal) {
    continue;
  }
  const fileTarget = path.join(target, `${script}.md`);
  await fs.ensureDir(path.dirname(fileTarget));
  await fs.writeFile(fileTarget, getScriptPageMd(data));
  const shortSummary = data.summary.replaceAll("\n", "").slice(0, 200) + (data.summary.length > 200 ? "..." : "");
  scriptList.push(`- [${script}](https://scripts.lukasbach.com/${script}) - ${shortSummary}`);
}

const readme = await fs.readFile(path.join(scriptsRoot, "../../README.md"), "utf-8");
const patchedReadme = readme.replace(/<!-- scripts:start -->[\s\S]*<!-- scripts:end -->/, () => {
  return `<!-- scripts:start -->\n${scriptList.join("\n")}\n<!-- scripts:end -->`;
});
await fs.writeFile(path.join(scriptsRoot, "../../README.md"), patchedReadme);

await fs.ensureDir(path.join(target, "about"));
await fs.copy(path.join(scriptsRoot, "../../README.md"), path.join(target, `about/README.md`));

await fs.writeFile(path.join(target, `about/shortcuts.md`), getShortcutsMd());

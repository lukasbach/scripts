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
  scriptList.push(
    `### ${data.command}\n\n${data.summary}\n\n- [\`${script}\`](https://scripts.lukasbach.com/${script})`
  );
}

await fs.ensureDir(path.join(target, "about"));
await fs.copy(path.join(scriptsRoot, "../../README.md"), path.join(target, `about/README.md`));

await fs.writeFile(path.join(target, `about/shortcuts.md`), getShortcutsMd());

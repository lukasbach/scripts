/** @internal */

import { marked } from "marked";
import { getScriptPaths, resolveScriptData } from "./utils.js";
import { getContainerHtml, getScriptPageHtml } from "./web-utils.js";

const scriptData = await resolveScriptData(await getScriptPaths());
const target = await ask.text("dest,d", "Where should the documentation be stored?", "./docs");

for (const script of Object.keys(scriptData)) {
  if (!scriptData[script].isInternal) {
    const html = getContainerHtml(
      Object.values(scriptData),
      scriptData[script].command,
      getScriptPageHtml(scriptData[script])
    );
    const fileTarget = path.join(target, `${script}.html`);
    await fs.ensureDir(path.dirname(fileTarget));
    await fs.writeFile(fileTarget, html);
  }
}

const html = getContainerHtml(
  Object.values(scriptData),
  "@lukasbach/scripts",
  await marked.parse(await fs.readFile(path.join(scriptsRoot, "../../README.md"), "utf-8"))
);
await fs.writeFile(path.join(target, `index.html`), html);

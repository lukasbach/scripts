/** @internal */

import { marked } from "marked";
import { getScriptPaths, resolveScriptData } from "./utils.js";
import { getContainerHtml, getScriptPageHtml } from "./web-utils.js";

const scriptData = await resolveScriptData(await getScriptPaths());
const target = await ask.text("dest,d", "Where should the documentation be stored?", "./docs");

for (const script of Object.keys(scriptData)) {
  const html = getContainerHtml(
    Object.values(scriptData),
    scriptData[script].command,
    getScriptPageHtml(scriptData[script])
  );
  const fileTarget = path.join(target, `${script}.html`);
  await fs.ensureDir(path.dirname(fileTarget));
  await fs.writeFile(fileTarget, html);
}

const html = getContainerHtml(
  Object.values(scriptData),
  "@lukasbach/scripts",
  await marked.parse(await fs.readFile(path.join(scriptsRoot, "../../README.md"), "utf-8"))
);
await fs.writeFile(path.join(target, `index.html`), html);
await fs.copy(path.join(scriptsRoot, "../../assets/docs-styles.css"), path.join(target, `styles.css`));
await fs.copy(path.join(scriptsRoot, "../../assets/fonts"), path.join(target, `fonts`));

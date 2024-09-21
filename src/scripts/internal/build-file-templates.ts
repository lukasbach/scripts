/** @internal */

import pathLib from "path";
import { FileTemplateHeader, FileTemplateIndex } from "./file-template-utils.js";

const templateFiles = await glob("templates/file-templates/**/*.hbs", {
  cwd: pathLib.join(global.scriptsRoot, "../.."),
});

const templateDistDir = pathLib.join(global.scriptsRoot, "../..", "lib/file-templates");
log.verbose(`Using dist dir ${templateDistDir}`);

const templateIndex = {};
await fs.ensureDir(templateDistDir);

for (const templateFile of templateFiles) {
  const contents = await fs.readFile(templateFile, "utf-8");
  const [headerBlock, ...blocks] = contents.split("\n===== ");
  const header = FileTemplateHeader.parse(yaml.parse(headerBlock));

  templateIndex[pathLib.basename(templateFile, ".hbs")] = header;
  await fs.writeJSON(pathLib.join(templateDistDir, `${pathLib.basename(templateFile, ".hbs")}.json`), {
    header,
    files: blocks.map((block) => {
      const [filename, ...lines] = block.split("\n");
      return { filename, template: lines.join("\n") };
    }),
  });

  log.success(`Parsed template ${header.name}`);
}

await fs.writeJSON(pathLib.join(templateDistDir, "index.json"), FileTemplateIndex.parse(templateIndex));

/** @internal */

import pathLib from "path";
import { FileTemplateHeader, FileTemplateIndex, getTemplateIndexMd, getTemplateMd } from "./file-template-utils.js";

const templateFiles = await glob("templates/file-templates/**/*.hbs", {
  cwd: pathLib.join(global.scriptsRoot, "../.."),
});

const templateDistDir = pathLib.join(global.scriptsRoot, "../..", "lib/file-templates");
const docsDir = pathLib.join(global.scriptsRoot, "../..", "docs/about");
log.verbose(`Using dist dir ${templateDistDir}`);

const templateIndex = {};
await fs.ensureDir(templateDistDir);

const readTemplateFile = async (templateFile) => {
  const contents = await fs.readFile(templateFile, "utf-8");
  const [headerBlock, ...blocks] = contents.split("\n===== ");
  const header = FileTemplateHeader.parse(yaml.parse(headerBlock));
  const files = await Promise.all(
    blocks.map(async (block) => {
      const [filenameLine, ...lines] = block.split("\n");
      const [fileId, fileName] = filenameLine.split(":");
      let fileHeader = header.files?.[fileId] ?? {};
      let template = lines.join("\n");
      if (fileHeader?.import) {
        const [importFile, importName] = fileHeader.import.split(":");
        const importContent = await readTemplateFile(pathLib.join(pathLib.dirname(templateFile), importFile));
        const importContentFile =
          importContent.files?.find((f) => f.fileId === importName) ??
          log.exit(`Import ${fileHeader.import} not found`);
        template = importContentFile.template ?? log.exit(`Import ${fileHeader.import} not found`);
        fileHeader = { ...fileHeader, ...importContentFile.header };
      }
      return { fileId, fileName, header: fileHeader, template };
    })
  );
  return { header, files, id: pathLib.basename(templateFile, ".hbs") };
};

export type ParsedFileTemplate = Awaited<ReturnType<typeof readTemplateFile>>;

for (const templateFile of templateFiles) {
  const template = await readTemplateFile(templateFile);

  templateIndex[template.id] = template.header;
  await fs.writeJSON(pathLib.join(templateDistDir, `${template.id}.json`), template);
  await fs.writeFile(pathLib.join(docsDir, `templates/${template.id}.md`), getTemplateMd(template));

  log.success(`Parsed template ${template.header.name}`);
}

await fs.writeJSON(pathLib.join(templateDistDir, "index.json"), FileTemplateIndex.parse(templateIndex));
await fs.writeFile(
  pathLib.join(docsDir, `file-templates.md`),
  getTemplateIndexMd(FileTemplateIndex.parse(templateIndex))
);

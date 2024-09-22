import pathLib from "path";
import { z } from "zod";
import handlebars from "handlebars";
import { FileTemplateConfig, FileTemplateIndex, FileTemplateVariable } from "./internal/file-template-utils.js";

/** Create files based on a template definition. */

const templateDistDir = pathLib.join(global.scriptsRoot, "../..", "lib/file-templates");
const templateIndex = FileTemplateIndex.parse(await fs.readJSON(pathLib.join(templateDistDir, "index.json")));

const templateSearch = await ask.choice(
  "_",
  "Choose a template to execute",
  Object.entries(templateIndex).map(([key, value]) => ({
    name: `${value.name} (${value.shorts?.join(", ")})`,
    short: value.shorts?.[0],
    value: key,
  }))
);
const templateName = templateIndex[templateSearch]
  ? templateSearch
  : Object.entries(templateIndex).find(([key, value]) => value.shorts?.includes(templateSearch))?.[0];

if (!templateName) {
  log.exit(`Could not find template ${templateSearch}`);
  process.exit(1);
}

const variables = {};

const askVariable = async (variable: z.infer<typeof FileTemplateVariable>) => {
  const defaultValue = handlebars.compile(variable.default ?? "")(variables);
  switch (variable.type) {
    case "number":
      return ask.number(variable.name, variable.message, defaultValue);
    case "choice":
      return ask.choice(variable.name, variable.message, variable.choices ?? [], defaultValue);
    default:
      return ask.text(variable.name, variable.message, defaultValue);
  }
};

for (const variable of templateIndex[templateName].variables) {
  variables[variable.name] = await askVariable(variable);
}

const templateConfig = FileTemplateConfig.parse(
  await fs.readJSON(pathLib.join(global.scriptsRoot, "../..", "lib/file-templates", `${templateName}.json`))
);

for (const file of templateConfig.files) {
  const filename = handlebars.compile(file.fileName)(variables);
  if (file.fileId in global.args) {
    continue;
  }
  if (file.header.ask || file.header.default === false) {
    if (file.header.ask) {
      if (!(await ask.bool(file.fileId, `Write ${file.fileId} file? (${filename})`, file.header.default ?? true))) {
        templateConfig.files = templateConfig.files.filter((f) => f !== file);
      }
    } else {
      log.info(`Skipping ${file.fileId} file (${filename}). Use --${file.fileId} to write file.`);
      templateConfig.files = templateConfig.files.filter((f) => f !== file);
    }
  }
}

for (const file of templateConfig.files) {
  const filename = handlebars.compile(file.fileName)(variables);
  const content = handlebars.compile(file.template)(variables);
  await fs.writeFile(filename, content);
  log.success(`Wrote ${filename}`);
}

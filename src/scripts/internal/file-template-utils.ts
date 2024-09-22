/** @internal */
import { z } from "zod";
import type { ParsedFileTemplate } from "./build-file-templates.js";

export const FileTemplateVariable = z.object({
  name: z.string(),
  message: z.string(),
  default: z.string().nullish(),
  type: z.enum(["string", "number", "choice"]).nullish(),
  choices: z.string().array().nullish(),
});

const FileTemplateFileHeader = z.object({
  ask: z.boolean().nullish(),
  default: z.boolean().nullish(),
  import: z.string().nullish(),
});

export const FileTemplateHeader = z.object({
  name: z.string(),
  shorts: z.string().array().nullish(),
  variables: z
    .object({
      name: z.string(),
      message: z.string(),
      default: z.string().nullish(),
    })
    .array(),
  files: z.record(z.string(), FileTemplateFileHeader).nullish(),
});

export const FileTemplateIndex = z.record(z.string(), FileTemplateHeader);

export const FileTemplateConfig = z.object({
  header: FileTemplateHeader,
  files: z
    .object({ fileName: z.string(), fileId: z.string(), template: z.string(), header: FileTemplateFileHeader })
    .array(),
});

export const getTemplateMd = (template: ParsedFileTemplate) => {
  const shortsText = `
After installing \`ldo\` with \`npm install -g @lukasbach/scripts\`, you can use any of the shortcuts
${template.header.shorts?.map((s) => `\`${s}\``).join(", ")} to run this script, such as:

\`\`\`bash
npm install -g @lukasbach/scripts
ldot ${template.header.shorts?.[0]}
\`\`\``;

  const variablesText = `
## Variables

${template.header.variables
  .map(
    (v) =>
      `- **${v.name}**: ${v.message} (default: \`${v.default ?? "unspecified"}\`)\n` +
      `  - Specify with \`--${v.name} <value>\``
  )
  .join("\n     ")}`;

  return `---
title: ${template.header.name}
sidebarTitle: ${template.id}
---

Create files based on this template with:

\`\`\`bash
npx @lukasbach/scripts template ${template.id}
\`\`\`

${template.header.shorts?.length ? shortsText : ""}

${template.header.variables?.length ? variablesText : ""}

## Files
Running the template will create the following files:

${template.files
  .map(
    (f) => `### ${utils.changeCase.sentenceCase(f.fileId)} (\`${f.fileName}\`)
${
  !f.header.ask && f.header.default === false
    ? `This file will only be created when called with \`--${f.fileId}\`.`
    : ""
}
${
  f.header.ask
    ? `The tool will interactively ask if the file should be created. Force create with \`--${f.fileId}\`.`
    : ""
}

\`\`\`hbs\n${f.template}\n\`\`\``
  )
  .join("\n\n")}`;
};

export const getTemplateIndexMd = (templates: z.infer<typeof FileTemplateIndex>) => {
  return `---
order: 98
---  
# File Templates

File templates are small template scripts that generate a set of related files when called. They can be used
to quickly scaffold new components for projects, and are customizable. You can preview the file templates for
each of the file template sets below.

\`\`\`bash
npx @lukasbach/scripts template {templateid}
\`\`\`

Once you have \`ldo\` installed, you can also use the \`ldot\` utility to run the templates directly:

\`\`\`bash
npm install -g @lukasbach/scripts
ldot {templateid}
\`\`\`

## Available Templates

The following templates are available:

${Object.entries(templates)
  .map(([id, header]) => `- [${header.name}](/about/templates/${id})\n  - \`ldot ${header.shorts?.[0] ?? id}\``)
  .join("\n")}`;
};

/** @internal */

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

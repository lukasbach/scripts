/** @internal */

export const FileTemplateVariable = z.object({
  name: z.string(),
  message: z.string(),
  default: z.string().nullish(),
  type: z.enum(["string", "number", "choice"]).nullish(),
  choices: z.string().array().nullish(),
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
});

export const FileTemplateIndex = z.record(z.string(), FileTemplateHeader);

export const FileTemplateConfig = z.object({
  header: FileTemplateHeader,
  files: z.object({ filename: z.string(), template: z.string() }).array(),
});

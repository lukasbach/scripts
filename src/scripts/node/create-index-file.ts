/** Create an index.ts file that reexports from all files in the directory */

import pathLib from "path";

const filesInDir = await fs.readdir(process.cwd());
const files = filesInDir
  .filter((f) => f.endsWith(".ts") || !f.includes("."))
  .filter((f) => f !== "index.ts")
  .filter((f) => f.includes(".") || fs.existsSync(pathLib.join(process.cwd(), f, "index.ts")));
const content = files.map((f) => `export * from "./${f.replace(".ts", "")}";`).join("\n");
const indexFile = pathLib.join(process.cwd(), "index.ts");

if (await fs.exists(indexFile)) {
  await fs.unlink(indexFile);
}

await fs.writeFile(indexFile, content);
log.success(`Wrote file ${indexFile} with ${files.length} exports`);

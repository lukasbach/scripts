/** Removes duplicate entries in a gitignore file */

const gitignoreFile = await ask.path("file,f", "Where is the gitignore file?", ".gitignore", [".gitignore"]);

const gitignore = await fs.readFile(gitignoreFile, "utf-8");
const lines = gitignore.split("\n");
const uniqueLines = lines.filter((line, index) => lines.indexOf(line) === index || line.trim() === "");
await fs.writeFile(gitignoreFile, uniqueLines.join("\n"));

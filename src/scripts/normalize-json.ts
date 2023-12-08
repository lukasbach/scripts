/** Runs JSON.stringify(JSON.parse()) on a file to normalize it. Normalizes with two spaces. */

const file = await ask.text("file", "Which file do you want to normalize?", "file.json");
await fs.writeJSON(file, await fs.readJSON(file), { spaces: 2 });

/** @internal */

import { getScriptPaths, resolveScriptData } from "./utils.js";

const scriptData = await resolveScriptData(await getScriptPaths());
const script = scriptData[args._[0]];

if (!script) {
  throw new Error(`Script ${args._[0]} not found`);
}

console.log(`# ${script.script}\n`);
console.log(script.summary);

console.log("Options:");
for (const question of script.questions) {
  const keys = question.keys
    .sort((a, b) => b.length - a.length)
    .map((k) => (k.length === 1 ? `-${k}` : `--${k}`))
    .join(", ");
  console.log(`  ${keys}: ${question.question}`);
}

if (script.questions.length === 0) {
  console.log("  none");
}

console.log("\n\nYou can also omit options, and will be asked for them interactively.");
console.log("Add --yes to skip all confirmations.");

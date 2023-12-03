/** @internal */

import { getScriptPaths, resolveScriptData } from "./utils.js";

const scriptData = await resolveScriptData(await getScriptPaths());
const script = scriptData[args._[0]];

if (!script) {
  log.exit(`Script ${args._[0]} not found`);
}

log.out(`# ${script.script}\n`);
log.out(script.summary);

log.out("Options:");
let i = 0;
for (const question of script.args) {
  log.out(`  [${i++}]: ${question.question}`);
}
for (const question of script.options) {
  const keys = question.keys
    .sort((a, b) => b.length - a.length)
    .map((k) => (k.length === 1 ? `-${k}` : `--${k}`))
    .join(", ");
  log.out(`  ${keys}: ${question.question}`);
}

if (script.options.length === 0 && script.args.length === 0) {
  log.out("  none");
}

log.out("\n\nYou can also omit options, and will be asked for them interactively.");
log.out("Add --yes to skip all confirmations.");

/** @internal */

import { getScriptPaths, resolveScriptData } from "./utils.js";

const scriptData = await resolveScriptData(await getScriptPaths());

console.log(`You can run each script with
  npx @lukasbach/scripts <script>

or by installing the tool globally and run each script directly with

  npm i -g @lukasbach/scripts
  ldo <script>
  
Available scripts:`);

for (const script of Object.keys(scriptData)) {
  if (!scriptData[script].isInternal) {
    console.log(`  ${script}`);
  }
}

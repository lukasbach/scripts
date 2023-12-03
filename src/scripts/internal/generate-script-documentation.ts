/** @internal */

import { getScriptPaths, resolveScriptData } from "./utils.js";

console.log(await resolveScriptData(await getScriptPaths()));

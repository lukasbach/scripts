/** Kills all node processes. Only works under windows. */

await $`taskkill /f /im node.exe`;

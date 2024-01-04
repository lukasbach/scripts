/** Prints help information for the tool. Append a script name to get help for that script. */

if (args._.length === 0) {
  await utils.runScript("internal/list-available-scripts", global.args);
} else {
  await utils.runScript("internal/print-script-docs", global.args);
}

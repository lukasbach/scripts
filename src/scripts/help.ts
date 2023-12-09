if (args._.length === 0) {
  await utils.runScript("internal/list-available-scripts", global.args);
} else {
  await utils.runScript("internal/print-script-docs", global.args);
}

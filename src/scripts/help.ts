if (args._.length === 0) {
  utils.runScript("internal/list-available-scripts");
} else {
  utils.runScript("internal/print-script-docs");
}

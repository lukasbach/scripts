#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as execa from "execa";
import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import { glob } from "glob";
import { fileURLToPath } from "url";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import inquirer from "inquirer";
import gotLib from "got";
import * as ask from "./ask.js";
import * as log from "./log.js";
import * as utils from "./utils.js";
import { defaultShortcuts } from "./shortcuts.js";

inquirer.registerPrompt("autocomplete", inquirerPrompt);

const argv = await yargs(hideBin(process.argv)).help(false).argv;
const [script, ...args] = argv._;
global.args = { ...argv, _: args };

if (Object.values(global.args).some((v: any) => v.toString().includes('"'))) {
  log.warn(
    'Argument found that included a " character. If args were not parsed incorrectly, try escaping the second quote with a backslash (https://github.com/nodejs/node/issues/21854#issuecomment-405671104)'
  );
}

global.$ = execa.$;
global.fs = fs.default as any;
global.path = path.posix;
global.os = os;
global.got = gotLib;
global.ask = ask;
global.log = log;
global.utils = utils;
global.glob = glob;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
global.scriptsRoot = path.join(dirname, "../scripts");

const shortcuts = await fs.default.readJSON(utils.getShortcutsFile()).catch(() => defaultShortcuts);

if (!script) {
  await utils.runScript("find");
  process.exit(0);
}

if (script in shortcuts) {
  const resolvedScripts = shortcuts[script].split(",").map((s) => s.trim());
  for (const resolvedScript of resolvedScripts) {
    await utils.runScript(resolvedScript, global.args);
  }
  process.exit(0);
}

await utils.runScript(`${script}`, global.args);
log.muted(`Script finished. Run the following the run again with the same parameters:`);
// eslint-disable-next-line no-underscore-dangle
log.muted(ask._rebuildCommand(script as string));

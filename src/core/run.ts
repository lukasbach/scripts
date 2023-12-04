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
import * as ask from "./ask.js";
import * as log from "./log.js";
import * as utils from "./utils.js";

inquirer.registerPrompt("autocomplete", inquirerPrompt);

const argv = await yargs(hideBin(process.argv)).help(false).argv;
const [script, ...args] = argv._;

global.args = { ...argv, _: args };
global.$ = execa.$;
global.fs = fs.default as any;
global.path = path;
global.os = os;
global.ask = ask;
global.log = log;
global.utils = utils;
global.glob = glob;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
global.scriptsRoot = path.join(dirname, "../scripts");

const shortcuts = await fs.default.readJSON(utils.getShortcutsFile());

if (!script) {
  await utils.runScript("find");
  process.exit(0);
}

if (script in shortcuts) {
  const resolvedScripts = shortcuts[script].split(",").map((s) => s.trim());
  for (const resolvedScript of resolvedScripts) {
    await utils.runScript(resolvedScript);
  }
  process.exit(0);
}

await utils.runScript(`${script}`);

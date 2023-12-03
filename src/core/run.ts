#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as execa from "execa";
import * as fs from "fs-extra";
import * as path from "path";
import * as os from "os";
import { glob } from "glob";
import * as ask from "./ask.js";
import * as utils from "./utils.js";

const argv = await yargs(hideBin(process.argv)).argv;
const [script, ...args] = argv._;

global.args = { ...argv, _: args };
global.$ = execa.$;
global.fs = fs;
global.path = path;
global.os = os;
global.ask = ask;
global.utils = utils;
global.glob = glob;

await import(`../scripts/${script}.js`);

/* eslint-disable vars-on-top,no-var */
import type * as execaLib from "execa";
import type * as fsLib from "fs-extra";
import type * as pathLib from "path";
import type * as osLib from "os";
import { Arguments } from "yargs";
import type { glob as globLib } from "glob";
import type * as askLib from "./ask.js";
import type * as utilsLib from "./utils.js";

declare global {
  var args: Arguments;
  var $: typeof execaLib.$;
  var fs: typeof fsLib;
  var path: typeof pathLib;
  var os: typeof osLib;
  var ask: typeof askLib;
  var utils: typeof utilsLib;
  var glob: typeof globLib;
  var scriptsRoot: string;
}

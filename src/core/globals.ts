/* eslint-disable vars-on-top,no-var */
import type * as execaLib from "execa";
import type * as fsLib from "fs-extra";
import type * as pathLib from "path";
import type * as osLib from "os";
import type gotLib from "got";
import { Arguments } from "yargs";
import type { glob as globLib } from "glob";
import type * as yamlLib from "yaml";
import type { z as zodLib } from "zod";
import type * as askLib from "./ask.js";
import type * as utilsLib from "./utils.js";
import type * as logLib from "./log.js";

declare global {
  var args: Arguments;
  var $: typeof execaLib.$;
  var fs: typeof fsLib;
  var path: typeof pathLib;
  var os: typeof osLib;
  var got: typeof gotLib;
  var ask: typeof askLib;
  var utils: typeof utilsLib;
  var log: typeof logLib;
  var glob: typeof globLib; // TODO multi-glob support, and patch \\ to /
  var scriptsRoot: string;
  var yaml: typeof yamlLib;
  var z: typeof zodLib;
}

/* eslint-disable no-console */
import chalk from "chalk";

export const info = (...args: any[]) => {
  console.log(chalk.blueBright("info"), ...args);
};

export const verbose = (...args: any[]) => {
  if (global.args.v || global.args.verbose) {
    console.log(chalk.dim("verbose"), ...args);
  }
};

export const warn = (...args: any[]) => {
  console.log(
    chalk.bgYellow(chalk.black("warn")),
    ...args.map((arg) => (typeof arg === "string" ? chalk.yellow(arg) : arg))
  );
};

export const error = (...args: any[]) => {
  console.log(
    chalk.bgRed(chalk.white("error")),
    ...args.map((arg) => (typeof arg === "string" ? chalk.red(arg) : arg))
  );
};

export const exit = (...args): never => {
  error(...args);
  process.exit(1);
};

export const out = (...args) => {
  console.log(...args);
};

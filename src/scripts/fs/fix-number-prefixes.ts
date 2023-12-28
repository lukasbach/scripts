/**
 * Takes a set of files with numbers, and prefixes the numbers with zeros so they are all the same length.
 */
import chalk from "chalk";

const filesGlob = await ask.path("f,files", "Files to fix", "*.png");
const files = await glob(filesGlob);

const longestFileName = files.reduce((a, b) => (a.length > b.length ? a : b));
const prefix = files.reduce((pref, fileName) => {
  for (let i = 0; i < longestFileName.length; i++) {
    if (fileName[i] !== pref[i]) {
      return pref.slice(0, i);
    }
  }
  return "";
}, longestFileName);
const suffix = files.reduce((suff, fileName) => {
  for (let i = 0; i < longestFileName.length; i++) {
    if (fileName[fileName.length - i - 1] !== suff[suff.length - i - 1]) {
      return suff.slice(suff.length - i);
    }
  }
  return "";
}, longestFileName);
const numberLength = longestFileName.length - prefix.length - suffix.length;

const getNewFileName = (file: string) => {
  const number = file.slice(prefix.length, file.length - suffix.length);
  const paddedNumber = number.padStart(numberLength, "0");
  return prefix + paddedNumber + suffix;
};

for (const file of files) {
  const newFile = getNewFileName(file);
  if (newFile !== file) {
    log.info(`Will rename...\n  ${chalk.red(file)} to\n  ${chalk.green(newFile)}`);
  } else {
    log.info(`Will skip...\n  ${chalk.dim(file)}`);
  }
}

log.info(`Renaming pattern is ${chalk.green(prefix)}${chalk.red("0".repeat(numberLength))}${chalk.green(suffix)}`);

if (!(await ask.confirm("c,confirm", "Confirm?"))) {
  log.exit("Cancelled");
}

for (const file of files) {
  const newFile = getNewFileName(file);
  if (newFile !== file) {
    await fs.rename(file, newFile);
    log.muted(`Renamed ${file}`);
  }
}

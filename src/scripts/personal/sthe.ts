/**
 * @private
 */

import chalk from "chalk";

try {
  await $`7z`;
} catch {
  log.exit("Make sure to place the 7z binary in your PATH");
}

const zip = await ask.path("zip", "Path to zip export");
const dist = await ask.path("dist", "dist path", "./export");
const blacklistFolder = await ask.path(
  "bl",
  "Blacklist folder, folder of items with names to ignore. Leave empty to not use.",
  ""
);
const tmpFolder = path.join(process.cwd(), `_tmp`);

const blackListedItems = blacklistFolder ? await fs.readdir(blacklistFolder) : [];
log.info(`Ignoring ${blackListedItems.length} items`);

await fs.ensureDir(tmpFolder);

await $`7z x ${zip} -o_tmp`;

log.info(`Copying to ${dist}`);
await fs.ensureDir(dist);

const getNewFilename = (perf: string | undefined, title: string | undefined, filePath: string) => {
  const ext = path.extname(filePath);
  if (perf && title) {
    return `${perf} - ${title}${ext}`;
  }
  if (title) {
    return `Unknown - ${title}${ext}`;
  }
  if (perf) {
    return `${perf} - ${path.win32.basename(filePath)}`;
  }
  return `Unknown - ${path.win32.basename(filePath)}`;
};

for (const item of await fs.readdir(path.join(tmpFolder, "scenes"))) {
  const content = await fs.readJSON(path.join(tmpFolder, "scenes", item));
  const file = content.files?.[0];

  if (!file) continue;

  const perf = content.performers?.[0];
  const { title } = content;
  const newFilename = path.join(dist, getNewFilename(perf, title, file));

  if (blackListedItems.includes(path.basename(newFilename))) {
    log.info(`Ignoring ${chalk.yellow(file)} because it is blacklisted`);
    continue;
  }

  log.info(`Copying\n    ${chalk.yellow(file)}\n -> ${chalk.green(newFilename)}`);
  await fs.copy(file, newFilename);
}

await fs.remove(tmpFolder);

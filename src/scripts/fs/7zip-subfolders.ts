/**
 * Move a list of folders into 7zip archives with the same name as the folders.
 */

try {
  await $`7z`;
} catch {
  log.exit("Make sure to place the 7z binary in your PATH");
}

const itemsGlob = await ask.text("items", "What are the items to archive?", "./*");
const target = await ask.text("target", "Where should the archives be placed?", ".");
const compression = await ask.choice(
  "compression,c",
  "Compression Level (0=store, 9=highest)",
  ["0", "1", "3", "5", "7", "9"],
  "5"
);
const removeOldItems = await ask.bool("move,m", "Should the old items be deleted?");
const items = await glob(itemsGlob);

log.info(items.join(", "));

if (!(await ask.confirm("These are the folders that will be moved. Continue?"))) {
  process.exit(0);
}

for (const item of items) {
  const archiveName = path.join(process.cwd(), target, `${item}.7z`);
  log.info(`Moving ${item} to ${archiveName}`);
  await fs.ensureDir(target);

  const from = path.join(process.cwd(), item, "*");
  await $`7z a ${archiveName} ${from} -mx=${compression} -mtm=on -mtc=on`;

  if (removeOldItems) {
    log.info(`Deleting ${item}`);
    await fs.remove(item);
  }
}

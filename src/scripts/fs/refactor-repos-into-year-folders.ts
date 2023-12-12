/**
 * Go through a folder of repos, and move them into year folders based on their first-commit date. If a folder
 * has no git repo, it is ignored. Needs to run in the folder containing the repos.
 *
 * This will move the files, not copy them.
 */

const target = await ask.text("target", "What is the target folder?", ".");

await fs.ensureDir(target);
const items = await fs.readdir(".");

let movedItems = 0;
let skippedItems = 0;

for (const item of items) {
  if (!(await fs.exists(path.join(item, ".git")))) {
    log.info(`Skipping ${item} as it is not a git repo`);
    skippedItems++;
    continue;
  }

  let year: string;

  try {
    const years = await $({ cwd: path.join(process.cwd(), item) })`git log --reverse --pretty=format:%ci`;
    year = years.stdout.slice(0, 4);
  } catch (e) {
    log.info(`Skipping ${item} because of git error: ${e}`);
    skippedItems++;
    continue;
  }
  log.info(`Moving ${item} to ${path.join(target, year, item)}`);
  await fs.ensureDir(path.join(target, year));
  await fs.move(item, path.join(target, year, item));
  movedItems++;
}

log.info(`Moved ${movedItems} items, skipped ${skippedItems} items`);

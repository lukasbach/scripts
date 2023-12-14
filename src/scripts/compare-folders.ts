/**
 * Compares two folders and lists missing items and files that are different. Supports
 * comparing files based on either file size, file size and edit date or file hash. For
 * hashing, SHA1 is used which is fast and works well for large files.
 *
 * You might want to use the verbose flag (-v) for folders with many large items to keep
 * track of progress.
 */
import { compareErrors, compareFiles } from "./compare-utils.js";

const root1 = await ask.text("folder1,a", "What is the first folder?");
const root2 = await ask.text("folder2,b", "What is the second folder?");
const compareMethod = await ask.choice("compare,c", "How should files be compared?", ["size", "datesize", "hash"]);

let missingItems1 = 0;
let missingItems2 = 0;
let differentItems = 0;
let comparisons = 0;

const compareAtPath = async (filePath: string) => {
  comparisons++;
  if (!(await compareFiles(path.join(root1, filePath), path.join(root2, filePath), compareMethod))) {
    log.info(`File ${filePath} is different`);
    differentItems++;
  }
};

const traverseFolder = async (folder: string) => {
  log.verbose(`Traversing folder ${folder}`);
  for (const file of await fs.readdir(path.join(root1, folder))) {
    const filePath = path.join(folder, file);
    const stats = await fs.stat(path.join(root1, folder, file));

    if (!(await fs.exists(path.join(root2, filePath)))) {
      missingItems2++;
      log.info(`Item ${filePath} is missing in folder 2`);
      // eslint-disable-next-line no-continue
      continue;
    }

    if (stats.isDirectory()) {
      await traverseFolder(filePath);
    } else {
      await compareAtPath(filePath);
    }
  }

  for (const file of await fs.readdir(path.join(root2, folder))) {
    const filePath = path.join(folder, file);
    if (!(await fs.exists(path.join(root1, filePath)))) {
      missingItems1++;
      log.info(`Item ${filePath} is missing in folder 1`);
    }
  }
};

await traverseFolder("");

log.info(`${missingItems1} items missing in folder 1, ${missingItems2} items missing in folder 2`);
log.info(`${differentItems} items are different`);
log.info(`${comparisons} files compared`);
log.info(`${compareErrors} errors occured while creating file hashes.`);

if (missingItems1 === 0 && missingItems2 === 0 && differentItems === 0) {
  log.success("Folders are identical");
}

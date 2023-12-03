/**
 * Compares two folders and lists missing items and files that are different. Supports
 * comparing files based on either file size or file hash. For hashing, SHA1 is used
 * which is fast and works well for large files.
 *
 * You might want to use the verbose flag (-v) for folders with many large items to keep
 * track of progress.
 */

import * as crypto from "crypto";

const root1 = await ask.text("folder1,a", "What is the first folder?");
const root2 = await ask.text("folder2,b", "What is the second folder?");
const compareMethod = await ask.choice("compare,c", "How should files be compared?", ["size", "hash"]);

let missingItems1 = 0;
let missingItems2 = 0;
let differentItems = 0;
let errors = 0;

const hashFile = async (filePath: string) => {
  log.verbose(`Hashing file ${filePath}`);
  const fd = fs.createReadStream(filePath);
  const hash = crypto.createHash("sha1");
  hash.setEncoding("hex");
  fd.pipe(hash);
  return new Promise<string>((res) => {
    fd.on("end", () => {
      hash.end();
      res(hash.read());
    });
    fd.on("error", (err) => {
      log.error(`Error hashing file ${filePath}: ${err}`);
      errors++;
      return res("error");
    });
    fd.pipe(hash);
  });
};

const compareFile = async (filePath: string) => {
  if (compareMethod === "size") {
    const stats1 = await fs.stat(path.join(root1, filePath));
    const stats2 = await fs.stat(path.join(root2, filePath));
    if (stats1.size !== stats2.size) {
      log.info(`File ${filePath} is different in size`);
      differentItems++;
    }
  }

  if (compareMethod === "hash") {
    const hash1 = hashFile(path.join(root1, filePath));
    const hash2 = hashFile(path.join(root2, filePath));
    if ((await hash1) !== (await hash2)) {
      log.info(`File ${filePath} is different in hash`);
      differentItems++;
    }
  }
};

const traverseFolder = async (folder: string) => {
  log.verbose(`Traversing folder ${folder}`);
  for (const file of await fs.readdir(path.join(root1, folder))) {
    const filePath = path.join(folder, file);
    const stats = await fs.stat(path.join(root1, folder, file));

    if (!(await fs.exists(path.join(root2, filePath)))) {
      missingItems2++;
      log.info(`File ${filePath} is missing in folder 2`);
      // eslint-disable-next-line no-continue
      continue;
    }

    if (stats.isDirectory()) {
      await traverseFolder(filePath);
    } else {
      await compareFile(filePath);
    }
  }

  for (const file of await fs.readdir(path.join(root2, folder))) {
    const filePath = path.join(folder, file);
    if (!(await fs.exists(path.join(root1, filePath)))) {
      missingItems1++;
      log.info(`File ${filePath} is missing in folder 1`);
    }
  }
};

await traverseFolder("");

log.info(`${missingItems1} items missing in folder 1, ${missingItems2} items missing in folder 2`);
log.info(`${differentItems} items are different`);
log.info(`${errors} errors occured while creating file hashes.`);

/**
 * Compares two files to check if they are different. Supports
 * comparing files based on either file size, file size and edit date or file hash. For hashing, SHA1 is used
 * which is fast and works well for large files.
 */
import { compareFiles } from "./compare-utils.js";

// TODO make path properties, parse path, trim leading or trailing " symbols
const root1 = await ask.text("folder1,a", "What is the first folder?");
const root2 = await ask.text("folder2,b", "What is the second folder?");
const compareMethod = await ask.choice("compare,c", "How should files be compared?", ["size", "datesize", "hash"]);

if (await compareFiles(root1, root2, compareMethod)) {
  log.info("Files are equal");
} else {
  log.info("Files are different");
}

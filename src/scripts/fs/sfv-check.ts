/**
 * Load a SFV file and check files in a folder against it whether their checksums match.
 */

import md5File from "md5-file";
import * as path from "path";

const sfvFile = await ask.path("sfv", "Where is the SFV file?");
const folder = await ask.path("folder", "Which folder should be checked?", ".");

const files = glob.sync(`${folder}/**/*`);
const sfv = fs.readFileSync(sfvFile, "utf8");

const sfvLines = sfv
  .split("\n")
  .filter((line) => line.trim() !== "" && !line.trim().startsWith(";"))
  .map((line) => /(.+)\s([0-9a-fA-F]{32})/.exec(line))
  .filter((match): match is RegExpExecArray => !!match);

for (const file of files) {
  const fileMd5 = await md5File(file);
  const relativeFile = path.relative(folder, file);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const md5 = sfvLines.find(([_, lineFile]) => lineFile === relativeFile)?.[2];
  if (!md5) {
    log.error(`File ${relativeFile} is not in the SFV file`);
    log.verbose(`  Received ${fileMd5}`);
  } else if (md5 !== fileMd5) {
    log.error(`File ${relativeFile} does not match the checksum in the SFV file`);
    log.verbose(`  Expected: ${md5}, received ${fileMd5}`);
  } else {
    log.success(`File ${relativeFile} is OK`);
  }
}

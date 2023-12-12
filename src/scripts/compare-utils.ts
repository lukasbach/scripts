/** @internal */
import crypto from "crypto";

// eslint-disable-next-line import/no-mutable-exports
export let compareErrors = 0;

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
      compareErrors++;
      return res("error");
    });
    fd.pipe(hash);
  });
};

export const compareFiles = async (fileA: string, fileB: string, method: string) => {
  if (method === "size") {
    const stats1 = await fs.stat(fileA);
    const stats2 = await fs.stat(fileB);
    return stats1.size === stats2.size;
  }

  if (method === "datesize") {
    const stats1 = await fs.stat(fileA);
    const stats2 = await fs.stat(fileB);
    return stats1.size === stats2.size && stats1.mtimeMs === stats2.mtimeMs;
  }

  if (method === "hash") {
    const hash1 = hashFile(fileA);
    const hash2 = hashFile(fileB);
    return (await hash1) === (await hash2);
  }

  return true;
};

/** Kills active jest lock files under Windows. Can help in case that jest refuses to run because it can't access active locks */

await fs.remove(path.join(os.tmpdir(), "jest"));

/** Create zip files as backups of all git repositories matched by a glob. The repos will be re-pulled before
 *  being backed up, and only files from the remote and the history will be used for the backup. */

await utils.verifyZipBinary();
const reposGlob = await ask.glob(
  "repos,r",
  "Glob for repositories to be backed up (should match the .git folders)",
  "*/.git"
);
const targetFolder = await ask.path("target,t", "Folder to store the backups in", "./backups");

if (fs.existsSync(targetFolder)) {
  log.exit(`Target folder ${targetFolder} already exists.`);
}

const tmpFolder = path.join(os.tmpdir(), "git-backup");
log.muted(`Using ${tmpFolder} as temporary folder`);
await fs.ensureDir(targetFolder);

for (const repo of reposGlob) {
  log.info(`Processing ${repo}...`);
  const remoteOut = await $({ cwd: repo })`git remote -v`;
  const remote = /origin\s+(?<url>.+?)\s+\(fetch\)/.exec(remoteOut.stdout)?.groups?.url;
  if (!remote) {
    log.warn(`Could not find remote for ${repo}, skipping...`);
    continue;
  }
  const name = /\/(?<name>.+?)\.git/.exec(remoteOut.stdout)?.groups?.name;
  if (!name) {
    log.warn(`Could not find name for ${repo}, skipping...`);
    continue;
  }
  log.muted(`  Using ${remote} as remote`);
  log.muted("  Cloning...");
  await $`git clone ${repo} ${tmpFolder}`;
  log.muted("  Zipping...");
  await utils.zip(path.join(targetFolder, `${name}.7z`), path.join(tmpFolder, "*"));
  log.muted("  Cleaning up...");
  await fs.remove(tmpFolder);
}
log.success(`All repositories backed up to ${targetFolder}`);

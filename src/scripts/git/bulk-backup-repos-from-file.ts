/** Create zip files as backups of git repositories listed in a YAML configuration file. Each repo will be
 *  cloned (either with all branches or just the primary branch) and packaged into individual zip files. */

await utils.verifyZipBinary();

const normalizeRepoUrl = (url: string): string => {
  const bbmatch = url.match(/https:\/\/([^/]+)\/projects\/([^/]+)\/repos\/([^/?#]+)/);
  if (bbmatch) {
    const [, host, project, repo] = bbmatch;
    return `https://${host}/scm/${project.toLowerCase()}/${repo}.git`;
  }
  return url;
};

const RepoConfigSchema = z.object({
  repos: z.array(z.string()).describe("Array of repository URLs to backup"),
  full: z.boolean().default(false).describe("Whether to clone all branches (true) or just the primary branch (false)"),
});

const configFile = await ask.path("config,c", "Path to YAML configuration file", "./repo-backup-config.yml");

const targetFolder = await ask.path("target,t", "Folder to store the backups in", "./backups");

if (!fs.existsSync(configFile)) {
  log.exit(`Configuration file ${configFile} does not exist.`);
}

if (fs.existsSync(targetFolder)) {
  await ask.confirm(
    `Target folder ${targetFolder} already exists. Continue and potentially overwrite existing backups?`
  );
}

log.info(`Loading configuration from ${configFile}...`);
const configContent = await fs.readFile(configFile, "utf-8");
const configData = yaml.parse(configContent);

const parseResult = RepoConfigSchema.safeParse(configData);
if (!parseResult.success) {
  log.exit(`Invalid configuration file format: ${parseResult.error.message}`);
}

const config = parseResult.data!;
log.info(`Found ${config.repos.length} repositories to backup`);
log.info(`Full backup mode: ${config.full ? "enabled (all branches)" : "disabled (primary branch only)"}`);

const tmpFolder = path.join(os.tmpdir(), "git-backup-from-file");
log.muted(`Using ${tmpFolder} as temporary folder`);
await fs.ensureDir(targetFolder);

for (const [index, originalRepoUrl] of config.repos.entries()) {
  const repoUrl = normalizeRepoUrl(originalRepoUrl);

  log.info(`Processing repository ${index + 1}/${config.repos.length}: ${originalRepoUrl}...`);
  if (repoUrl !== originalRepoUrl) {
    log.muted(`  Normalized to: ${repoUrl}`);
  }

  const repoNameMatch = repoUrl.match(/\/([^/]+?)(?:\.git)?$/);
  const repoName = repoNameMatch?.[1];
  if (!repoName) {
    log.warn(`Could not extract repository name from URL ${repoUrl}, skipping...`);
    continue;
  }

  const repoTmpPath = path.join(tmpFolder, repoName);

  try {
    log.muted(`  Cloning ${config.full ? "with all branches" : "primary branch only"}...`);

    if (config.full) {
      await $`git clone --mirror ${repoUrl} ${repoTmpPath}`;
    } else {
      await $`git clone --depth 1 ${repoUrl} ${repoTmpPath}`;
    }

    log.muted("  Creating zip file...");
    const zipPath = path.join(targetFolder, `${repoName}.7z`);
    await utils.zip(zipPath, path.join(repoTmpPath, "*"));

    log.muted("  Cleaning up temporary files...");
    await fs.remove(repoTmpPath);

    log.success(`  ✓ ${repoName} backed up successfully`);
  } catch (error) {
    log.warn(`  Failed to backup ${repoName}: ${error}`);
    await fs.remove(repoTmpPath).catch(() => {});
    continue;
  }
}

await fs.remove(tmpFolder).catch(() => {});

log.success(`All repositories backed up to ${targetFolder}`);

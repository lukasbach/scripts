/**
 * Go through a list of locally cloned repositories, and for each of them, report
 * whether their main branch and all other branches are in sync with the remote,
 * of if there are uncommited changes, unsynced branches or missing remotes.
 */

import * as path from "path";

const reposGlob = await ask.glob(
  "repos,r",
  "Glob for repositories to be backed up (should match the .git folders)",
  "*/.git"
);

for (const repo of reposGlob) {
  log.muted(`${repo}: Processing...`);
  const $$ = $({ cwd: path.join(repo, "..") });

  const hasRemote = (await $$`git remote -v`).stdout !== "";
  if (!hasRemote) {
    log.error(`${repo}: No remote found`);
    continue;
  }

  const branches = (await $$`git for-each-ref --format='%(refname:short)' refs/heads/`).stdout
    .split("\n")
    .map((b) => b.slice(1, -1));
  log.info(`${repo}: Found branches: ${branches.join(", ")}`);

  if ((branches.length === 1 && branches[0] === "") || branches.length === 0) {
    log.error(`${repo}: No local branches`);
    continue;
  }

  const mainBranch = branches.find((b) => b === "main" || b === "master");

  for (const branch of branches) {
    const hasBranchRemote = (await $$`git ls-remote origin ${branch}`).stdout !== "";
    if (!hasBranchRemote) {
      const commitsNotOnMain = mainBranch && (await $$`git log ${mainBranch}..${branch}`).stdout;

      if (branch === mainBranch) {
        log.error(`${repo}: Main branch "${mainBranch}" has no remote`);
      } else if (commitsNotOnMain !== "") {
        log.error(`${repo}: Branch ${branch} has no remote and commits not on main`);
        log.verbose(commitsNotOnMain);
      } else {
        log.warn(`${repo}: Branch ${branch} has no remote, but commits are on main`);
      }
      continue;
    }

    const hasUncommitedChanges = (await $$`git status --porcelain`).stdout !== "";
    if (hasUncommitedChanges) {
      log.error(`${repo}: Branch ${branch} has uncommited changes`);
      continue;
    }

    log.success(`${repo}: Branch ${branch} is in sync`);
  }
}

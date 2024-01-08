/** Stash the currently changed files, go to main branch, update main, create a new branch, pop changes. */

const remoteOutput = await $`git remote show origin`;
const mainBranch = remoteOutput.stdout?.match(/HEAD branch: (.*)/)?.[1] ?? "main";

log.info(`Detected main branch as ${mainBranch}`);

const newBranchName = await ask.text("_", "New branchname", "feature");

await $`git stash`;
await $`git checkout ${mainBranch}`;
await $`git pull`;
await $`git checkout -b ${newBranchName}`;
await $`git stash pop`;

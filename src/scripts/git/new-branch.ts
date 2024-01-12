/** Stash the currently changed files, go to main branch, update main, create a new branch, pop changes. */

const $$ = $({
  shell: true,
  stdio: "inherit",
});

await $`git config --global credential.helper "store --timeout=60"`;
await $$`git remote show origin`;

const remoteOutput = await $`git remote show origin`;
console.log("!!", remoteOutput.stdout, "!!");
const mainBranch = remoteOutput.stdout?.match(/HEAD branch: (.*)/)?.[1] ?? "main";

log.info(`Detected main branch as ${mainBranch}`);

const newBranchName = await ask.text("_", "New branchname", "feature");

await $`git stash`;
await $`git checkout ${mainBranch}`;
await $`git pull`;
await $`git checkout -b ${newBranchName}`;
await $`git stash pop`;

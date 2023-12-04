/**
 * Checks your GitHub events to find branches you recently pushed to, and
 * displays a link to create a PR from that branch.
 *
 * Must be logged into GitHub CLI.
 */

import chalk from "chalk";

const githubUser = (await $`gh api user --jq .login`).stdout.trim();
const events: any[] = JSON.parse((await $`gh api /users/${githubUser}/events`).stdout.trim());
const relevantEvents = events
  .filter((e) => ["PushEvent"].includes(e.type))
  .filter((e) => !e.payload.ref.includes("gh-pages"));

const defaultBranches = {};
const foundOptions = new Set<string>();

const getDefaultBranch = async (repoName: string) => {
  if (defaultBranches[repoName]) {
    return defaultBranches[repoName];
  }
  const defaultBranch = (
    await $`gh repo view ${repoName} --json defaultBranchRef -q .defaultBranchRef.name`
  ).stdout.trim();
  defaultBranches[repoName] = defaultBranch;
  return defaultBranch;
};

for (const event of relevantEvents) {
  const defaultBranch = await getDefaultBranch(event.repo.name);
  if (event.payload.ref === `refs/heads/${defaultBranch}`) {
    continue;
  }

  const key = `${event.repo.name}:${event.payload.ref}`;

  if (foundOptions.has(key)) {
    continue;
  }

  const refsHead = "refs/heads/";
  const source = event.payload.ref.startsWith(refsHead) ? event.payload.ref.slice(refsHead.length) : event.payload.ref;

  try {
    await $({ env: { GH_REPO: event.repo.name } })`gh pr view ${source} --json id`;
    continue; // pr already exists
  } catch {
    // error: no pr exists. That's what we want
  }

  foundOptions.add(key);
  log.out(`${chalk.blueBright(event.repo.name)}: ${source} -> ${defaultBranch}`);
  log.out(
    `  ${chalk.underline(chalk.dim(`https://github.com/${event.repo.name}/compare/${defaultBranch}...${source}`))}`
  );
}

if (foundOptions.size === 0) {
  log.info("No relevant events found");
}

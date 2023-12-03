/**
 * Set's up the configuration file for this repo so that this project comes up in my list of projects on lukasbach.com
 * Only works for repositories hosted in the github.com/lukasbach account.
 * @private
 */

const repoName = (await $`gh repo view --json name -q .name`).stdout;
const title = await ask.text("title", "Enter a title:", repoName);
const category = await ask.choice("category", "Choose a category:", [
  "app",
  "library",
  "game",
  "plugin",
  "template",
  "cli",
]);
await fs.writeJson(
  path.join(await utils.node.getPackageRoot(), "homepagedata.json"),
  {
    repo: repoName,
    title,
    category,
  },
  { spaces: 2 }
);
log.info(`Done. Details on spec are available at https://github.com/lukasbach/lukasbachcom2023`);

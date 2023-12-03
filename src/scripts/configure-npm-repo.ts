const packageJson = await utils.node.getPackageJson();

const name = await ask.text("What is the name of the package?", packageJson.name);
const description = await ask.text("What is the description of the package?", packageJson.description);
const topics = (await ask.text("What are the tags of the package (comma seperated)?", packageJson.tags?.join(", ")))
  .split(",")
  .map((topic) => topic.trim());

const userName = await $`git config --global user.name`;
const email = await $`git config --global user.email`;

const author = await ask.text("What is the author of the package?", `${userName} <${email}>`);
const license = await ask.text("What is the license of the package?", packageJson.license);

if (!(await ask.confirm("The values will both be synced to the package.json and the Github Repo configuration."))) {
  process.exit(0);
}

await utils.node.amendPackageJson({
  name,
  description,
  tags: topics,
  author,
  license,
});

/**
 * Configures the package.json based on user input. Some settings, like description, are also synced to the Github repo.
 * Also fixes the repo url in the package.json based on the git remote.
 */

const packageJson = await utils.node.getPackageJson();

const name = await ask.text("name,n", "What is the name of the package?", packageJson.name);
const description = await ask.text("description,d", "What is the description of the package?", packageJson.description);
const topics = (
  await ask.text("topics", "What are the tags of the package (comma seperated)?", packageJson.tags?.join(", "))
)
  .split(",")
  .map((topic) => topic.trim());

const userName = (await $`git config --global user.name`).stdout;
const email = (await $`git config --global user.email`).stdout;

const author = await ask.text("a,author", "What is the author of the package?", `${userName} <${email}>`);
const license = await ask.text("l,license", "What is the license of the package?", packageJson.license);

const repositoryPromise = $`git config --get remote.origin.url`.catch(() => undefined);
const repository = (await repositoryPromise)?.stdout;

const githubUser = repository?.match(/github.com[:/](.*)\/(.*)/)?.[1];
const funding = await ask.text(
  "f,funding",
  "Do you want to add funding information to the package.json?",
  `https://github.com/sponsors/${githubUser}`
);

await utils.node.amendPackageJson({
  name,
  description,
  funding: funding.length > 0 ? funding : undefined,
  tags: topics,
  author,
  license,
  repository,
});

if (repository && (await ask.confirm("Do you want to sync topics and description to Github?"))) {
  await $`gh repo edit --add-topic=${topics.join(",")}`;
  await $`gh repo edit --description=${description}`;
}

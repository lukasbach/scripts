/** Creates a new Github repository and pushes the local git folder to that repo, configuring the repo as
 * git origin in the local repository in the process. */

import * as path from "path";

utils.assert(await fs.exists(".git"), "Not a git repository");
const repoName = await ask.text("_", "Repository name", path.basename(process.cwd()));
await $({ stdio: "inherit" })`gh repo create ${repoName} --private --push --source .`;

/** Sets up a GitHub Action to verify a NodeJS Project */

await utils.cd(await utils.node.getPackageRoot());
const { scripts } = await utils.node.getPackageJson();
const pm = await utils.node.getPackageManager();

let content = utils.noindent(`
  name: Verify
  on: 
    push:
    pull_request:
    workflow_dispatch:
  
  jobs:
    test:
      runs-on: ubuntu-latest
      permissions:
        contents: read
      steps:
        - uses: actions/checkout@v4
        - uses: volta-cli/action@v4
        - run: ${pm} install
  
  `);

if (scripts["build:ci"]) {
  content += `        - run: ${pm} run build:ci\n`;
} else if (scripts.build) {
  content += `        - run: ${pm} run build\n`;
}

if (scripts["build:docs"]) {
  content += `        - run: ${pm} run build:docs\n`;
}
if (scripts["build:storybook"]) {
  content += `        - run: ${pm} run build:storybook\n`;
}
if (scripts["build-storybook"]) {
  content += `        - run: ${pm} run build-storybook\n`;
}

if (scripts["test:ci"]) {
  content += `        - run: ${pm} run test:ci\n`;
} else if (scripts.test) {
  content += `        - run: ${pm} run test\n`;
}

if (scripts["lint:ci"]) {
  content += `        - run: ${pm} run lint:ci\n`;
} else if (scripts["lint:test"]) {
  content += `        - run: ${pm} run lint:test\n`;
} else if (scripts.lint) {
  content += `        - run: ${pm} run lint\n`;
}

await fs.ensureDir(".github/workflows");
await fs.writeFile(".github/workflows/verify.yml", content);

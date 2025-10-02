/** Run a package.json script in a NodeJS Package. Available scripts are automatically read
 * from the package.json file. The correct package manager is chosen based on available lock files.
 */

const prioOrder = ["start", "dev", "build", "test"];
const pkg = await utils.node.getPackageJson();
const scripts = Object.keys(pkg.scripts ?? {}).sort((a, b) => {
  const aIdx = prioOrder.indexOf(a);
  const bIdx = prioOrder.indexOf(b);
  return aIdx === -1 && bIdx === -1 ? a.localeCompare(b) : bIdx - aIdx;
});
const script = await ask.choice("s,script", `Which script to run from ${pkg.name ?? "Unnamed package"}?`, scripts);
await utils.node.runScript(script);

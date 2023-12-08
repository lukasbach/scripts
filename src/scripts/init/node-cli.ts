/** Initializes a NodeJS based CLI project */

// TODO cd between scripts doesnt yet properly work

await utils.runScript("node/setup-empty-yarn");
await utils.runScript("node/volta");
await utils.runScript("node/setup-tsconfig", {
  module: "nodenext",
  resolution: "nodenext",
  target: "es2021",
  lib: "es2021",
  emit: "Source and Declaration",
});

if (await ask.confirm("Do you want to use esbuild with my default config?")) {
  await utils.runScript("node/setup-eslint", { rule: "@lukasbach/base" });
}

if (await ask.confirm("Do you want to use publish-fast for releasing?")) {
  await utils.runScript("node/setup-publish-fast");
}

await utils.runScript("node/setup-commander");
await utils.runScript("github/setup-node-verify-action");
await utils.runScript("node/normalize-package-json");

const ruleSet = await ask.choice("rule", "Which rules to use?", ["@lukasbach/base", "@lukasbach/base/react"]);

await utils.node.addDevDependency("@lukasbach/eslint-config-deps");
await utils.node.addDevDependency("eslint");
await utils.node.amendPackageJson({
  extends: ruleSet,
  parserOptions: {
    project: "./tsconfig.json",
  },
  ignorePatterns: ["lib", "*.js"],
});

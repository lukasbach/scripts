/** Adds my personal ESLint config with @lukasbach/eslint-config-deps to the package setup. */

const ruleSet = await ask.choice("rule", "Which rules to use?", ["@lukasbach/base", "@lukasbach/base/react"]);

await utils.node.addDevDependency("eslint @lukasbach/eslint-config-deps");
await utils.node.amendPackageJson({
  scripts: {
    lint: "eslint .",
    "lint:fix": "eslint . --fix",
  },
  eslintConfig: {
    extends: ruleSet,
    parserOptions: {
      project: "./tsconfig.json",
    },
    ignorePatterns: ["lib", "*.js"],
  },
});

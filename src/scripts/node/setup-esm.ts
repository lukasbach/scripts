/**
 * Set's up ESM builds for a TS project. This includes updating the tsconfig, package.json, and file imports.
 */

const packageJson = await utils.node.getPackageJson();

await utils.node.addDevDependency("typescript@latest");

await utils.node.amendPackageJson({
  type: "module",
  main: undefined,
  exports: packageJson.main?.startsWith(".") ? packageJson.main : `./${packageJson.main}`,
  engines: {
    node: ">=16",
  },
});
await utils.node.amendTsconfig({
  compilerOptions: {
    module: "node16",
    moduleResolution: "node16",
    target: "esnext", // optional
  },
});

log.info("Updating imports...");
await utils.runScript("node/add-js-extensions-in-imports");

log.info("Remaining tasks:");
log.info(" - Make sure you have only full relative file imports: `import x from '.' -> import x from './index.js'`");
log.info(" - Prefix imports to node js packages with `node:`");
log.info(
  "Full Guide: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-make-my-typescript-project-output-esm"
);

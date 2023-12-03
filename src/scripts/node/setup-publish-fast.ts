/** Sets up a NPM package release configuration with the package publish-fast. */

await utils.node.addDevDependency("publish-fast");
await utils.node.amendPackageJson({
  publish: {
    preScripts: "build,lint:test,test",
    releaseNotesSource: "next-releasenotes.md",
  },
});
await fs.writeFile(path.join(await utils.node.getPackageRoot(), "next-releasenotes.md"), "");

/** Normalizes a package.json file and reorderes its properties in a way that is typical. */

await utils.cd(await utils.node.getPackageRoot());

const {
  name,
  type,
  version,
  private: privat,
  publishConfig,
  description,
  tags,
  author,
  license,
  repository,
  bin,
  main,
  exports,
  typings,
  scripts,
  files,
  dependencies,
  devDependencies,
  peerDependencies,
  engines,
  eslintConfig,
  publish,
  packageManager,
  volta,
  ...rest
} = await utils.node.getPackageJson();

await fs.writeJSON(
  "package.json",
  {
    name,
    type,
    version,
    private: privat,
    publishConfig,
    description,
    tags,
    author,
    license,
    repository,
    bin,
    main,
    exports,
    typings,
    scripts,
    files,
    dependencies,
    devDependencies,
    peerDependencies,
    engines,
    eslintConfig,
    publish,
    packageManager,
    volta,
    ...rest,
  },
  { spaces: 2 }
);

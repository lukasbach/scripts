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

const sortObject = (obj: Record<string, string>) => {
  if (!obj) return obj;
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      // eslint-disable-next-line no-param-reassign
      result[key] = obj[key];
      return result;
    }, {} as Record<string, string>);
};

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
    dependencies: sortObject(dependencies),
    devDependencies: sortObject(devDependencies),
    peerDependencies: sortObject(peerDependencies),
    engines,
    eslintConfig,
    publish,
    packageManager,
    volta,
    ...rest,
  },
  { spaces: 2 }
);

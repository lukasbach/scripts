/** Set's up a build configuration with Typescript by configuring the tsconfig.json file and adjusting package.json
 * and supporting files. */

await utils.cd(await utils.node.getPackageRoot());

const parentTsconfig = await utils.goUpTree(
  (dir) => dir !== process.cwd() && fs.pathExists(path.join(dir, "tsconfig.json"))
);
if (parentTsconfig) {
  if (await ask.bool("", `A parent tsconfig exists at ${parentTsconfig}, reference that?`, "Yes")) {
    await fs.writeJSON("./tsconfig.json", {
      $schema: "https://json.schemastore.org/tsconfig",
      extends: path.join(path.relative(process.cwd(), parentTsconfig), "tsconfig.json"),
      include: ["src"],
    });
    process.exit(0);
  }
}

const module = await ask.choice(
  "module,m",
  "What module system do you want to use?",
  [
    { name: "ESNext - Use for Web projects", value: "esnext" },
    { name: "NodeNext - Use for node.js projects", value: "nodenext" },
  ],
  "esnext"
);
const pureEsm = await ask.bool("esm", "Do you want to use pure ESM?", "No");

const moduleResolution = await ask.choice(
  "resolution,r",
  "What module resolution do you want to use?",
  [
    { name: "Bundler - Use for projects using a seperate bundler", value: "bundler" },
    { name: "NodeNext - Use for node.js projects", value: "nodenext" },
  ],
  "esnext"
);

const target = await ask.choice(
  "target,t",
  "Which target to compile to? Most browsers today support ES6. Node 16 supports ES2021.",
  ["es3", "es5", "es6", "es2016", "es2017", "es2018", "es2019", "es2020", "es2021", "es2022", "esnext"],
  module === "nodenext" ? "es2021" : "es6"
);

const lib = await ask.choice(
  "lib,l",
  "Which libraries to include?",
  [`${target}`, `${target}, DOM`, `${target}, DOM, WebWorker`],
  target
);

const emit = await ask.choice(
  "emit",
  "What to emit?",
  ["Nothing", "Source", "Source and Declaration", "Source, Declaration and Source Maps"],
  "Source and Declaration"
);

const strict = await ask.bool("strict,s", "Strict mode?", "Yes");

const outDir = await ask.text("output,o", "Output directory?", "lib");

await fs.writeJSON(
  "./tsconfig.json",
  {
    $schema: "https://json.schemastore.org/tsconfig",
    compilerOptions: {
      module,
      moduleResolution,
      target,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      lib: lib.split(", "),
      outDir,
      ...(strict ? { strict: true } : {}),
      ...(emit === "Nothing" ? { noEmit: true } : {}),
      ...(emit === "Source and Declaration" ? { declaration: true } : {}),
      ...(emit === "Declaration and Source Maps" ? { declaration: true, sourceMap: true } : {}),
    },
    include: ["src"],
  },
  { spaces: 2 }
);

if (pureEsm) {
  await utils.node.amendPackageJson({
    type: "module",
    main: undefined,
    exports: `./${path.join(outDir, "index.js")}`,
    typings: path.join(outDir, "index.d.ts"),
    scripts: {
      build: "tsc",
    },
    engines: {
      node: ">=16",
    },
  });

  log.info("Updating imports...");
  await utils.runScript("node/add-js-extensions-in-imports");
} else {
  await utils.node.amendPackageJson({
    type: "commonjs",
    main: path.join(outDir, "index.js"),
    typings: path.join(outDir, "index.d.ts"),
    exports: undefined,
    scripts: {
      build: "tsc",
    },
    engines: {
      node: ">=16",
    },
  });
}

await utils.amendFile("./.gitignore", (old) => `${old}\n${outDir}`);
await utils.runScript("deduplicate-gitignore", { file: "./.gitignore" });

await utils.node.addDevDependency("typescript@latest");

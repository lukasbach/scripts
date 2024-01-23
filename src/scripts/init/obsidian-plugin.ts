/** Initializes a Obsidian Plugin project. */

// TODO yet to be tested

await utils.runScript("node/setup-empty-yarn");

const useStyles = await ask.bool("css", "Do you want to use CSS?", true);

if ((await utils.node.getPackageJson()).name.startsWith("obsidian-")) {
  log.error("Please remove the obsidian- prefix from your package name.");
}

await utils.runScript("node/volta");

await utils.node.amendTsconfig({
  compilerOptions: {
    target: "es2019",
    module: "commonjs",
    emitDeclarationOnly: true,
    esModuleInterop: true,
    skipLibCheck: true,
    moduleResolution: "node",
    forceConsistentCasingInFileNames: true,
    jsx: "react",
  },
  include: ["src/**/*.ts", "src/**/*.tsx", "types.d.ts"],
});

if (await ask.confirm("Do you want to use eslint with my default config?")) {
  await utils.runScript("node/setup-eslint", { rule: "@lukasbach/base" });
}

await utils.runScript("node/setup-publish-fast");

await utils.runScript("node/setup-commander");
await utils.runScript("github/setup-node-verify-action");
await utils.runScript("node/normalize-package-json");

const packageJson = await utils.node.getPackageJson();

await fs.writeJSON(
  "./manifest.json",
  {
    id: packageJson.name,
    name: utils.changeCase.sentenceCase(packageJson.name),
    description: packageJson.description,
    author: await ask.text("author", "What is the author of the package?", "Lukas Bach"),
    authorUrl: await ask.text("url", "What is the url of the author?", "https://lukasbach.com"),
    minAppVersion: "0.15.0",
    version: packageJson.version,
  },
  { spaces: 2 }
);

const cssArg = useStyles ? "--with-stylesheet src/styles.css " : "";
await utils.node.amendPackageJson({
  scripts: {
    build: `obsidian-plugin build${cssArg} src/main.ts`,
    dev: `obsidian-plugin dev${cssArg} src/main.ts`,
    postversion: "node version-bump.mjs && yarn build",
    release: "publish-fast",
  },
  publish: {
    preScripts: "lint,build",
    skipPublish: true,
    releaseAssets: "dist/*",
    noVersionPrefix: true,
  },
});

await fs.writeJSON("./versions.json", { [packageJson.version]: "0.15.0" }, { spaces: 2 });

await fs.ensureDir("./src");

const { name } = packageJson;
await fs.writeFile("./src/main.ts", utils.loadTemplate("obsidian-plugin/main.ts.hbs", { name }));
await fs.writeFile("./src/plugin.ts", utils.loadTemplate("obsidian-plugin/plugin.ts.hbs", { name }));
await fs.writeFile("./src/settings.ts", utils.loadTemplate("obsidian-plugin/settings.ts.hbs", { name }));
await fs.writeFile("./src/settings-tab.ts", utils.loadTemplate("obsidian-plugin/settings-tab.ts.hbs", { name }));
await fs.writeFile("./version-bump.mjs", utils.loadTemplate("obsidian-plugin/version-bump.mjs.hbs", { name }));
await fs.writeFile(
  "./README.md",
  utils.loadTemplate("obsidian-plugin/readme.md.hbs", { name, description: packageJson.description })
);

if (useStyles) {
  await fs.writeFile("./types.d.ts", '// Empty declaration to allow for css imports\ndeclare module "*.css" {}\n');
  await fs.writeFile("./src/styles.css", "");
}

await fs.appendFile(".gitignore", "\ndist\n");
await utils.runScript("deduplicate-gitignore");

if (await ask.bool("git", "Do you want to initialize a github repository?")) {
  await utils.runScript("github/create-from-local");
}

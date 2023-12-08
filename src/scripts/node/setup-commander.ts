/** Configures a Typescript project to include dependencies and scaffolding setup for a commander CLI */

await utils.cd(await utils.node.getPackageRoot());

if (!(await fs.exists("tsconfig.json"))) {
  log.exit("No tsconfig.json found. Please run `node/setup-tsconfig` first.");
}

const { main, exports, name } = await utils.node.getPackageJson();
const binFolder = await ask.text("bin-folder", "Where should the binary be stored?", main ?? exports);
const binName = await ask.text("bin-folder", "What is the name of the CLI?", name);

await utils.node.amendPackageJson({
  bin: { [binName]: binFolder },
  scripts: {
    start: "esr src/index.ts",
  },
});

await utils.node.addDependency("commander");
await utils.node.addDevDependency("esbuild esbuild-runner");

const mainFileContents = utils.noindent(`
  #!/usr/bin/env node
  import { program } from "commander";
  import * as fs from "fs";
  import * as path from "path";
  
  interface Options {
    small?: boolean;
    pizzaType: string;
  }
  
  let cliVersion: string;
  try {
    cliVersion = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), { encoding: "utf-8" })).version;
  } catch (e) {
    cliVersion = "unknown";
  }
  
  program
    .version(cliVersion)
    .option("-s, --small", "small pizza size")
    .requiredOption("-p, --pizza-type <type>", "flavour of pizza");
  
  program.parse(process.argv);
  
  const options = program.opts() as Options;
  
  console.log(options);
  `);

await fs.ensureDir("src");
await fs.writeFile(path.join("src", "index.ts"), mainFileContents);

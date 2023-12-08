/** Configures a Typescript project to include dependencies and scaffolding setup for a commander CLI */

await utils.cd(await utils.node.getPackageRoot());

if (!(await fs.exists("tsconfig.json"))) {
  log.exit("No tsconfig.json found. Please run `node/setup-tsconfig` first.");
}

const simpleType = "Single Command";
const complexType = "Complex Setup with multiple commands";

const { main, exports, name } = await utils.node.getPackageJson();
const binFolder = await ask.text("bin-folder", "Where should the binary be stored?", main ?? exports);
const binName = await ask.text("bin-folder", "What is the name of the CLI?", name);
const setupType = await ask.choice(
  "commander-type",
  "Which commander setup do you want?",
  [simpleType, complexType],
  simpleType
);

await utils.node.amendPackageJson({
  bin: { [binName]: binFolder },
  scripts: {
    start: "esr src/index.ts",
  },
});

await utils.node.addDependency("commander");
await utils.node.addDevDependency("esbuild esbuild-runner");

if (setupType === simpleType) {
  await fs.ensureDir("src");
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

  await fs.writeFile("src/index.ts", mainFileContents);
}

if (setupType === complexType) {
  await fs.ensureDir("src/commands");
  const mainFileContents = utils.noindent(`
    #!/usr/bin/env node
    import * as fs from "fs";
    import * as path from "path";
    import { Command } from "commander";
    import { sampleCommand } from "./commands/sample";
    
    const program = new Command();
    
    let cliVersion: string;
    try {
      cliVersion = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../package.json"), {
          encoding: "utf-8",
        })
      ).version;
    } catch (e) {
      cliVersion = "unknown";
    }
    
    program.version(cliVersion).addCommand(sampleCommand);
    
    program.parse();
    `);

  const commandFileContents = utils.noindent(`
    import { Command, Option } from "commander";
    
    interface Options {
      flag?: boolean;
      str?: string;
      number2?: number;
    }
    
    export const sampleCommand = new Command("sample");
    
    sampleCommand.argument("<name>", "Name of the sample");
    
    sampleCommand.option("-f, --flag", "Flag");
    sampleCommand.option("-s, --str <string>", "String");
    sampleCommand.addOption(
      new Option("--number <number>").argParser((v) => parseInt(v, 10))
    );
    
    sampleCommand.action((name, options: Options) => {});
    `);

  await fs.writeFile("src/index.ts", mainFileContents);
  await fs.writeFile("src/commands/sample.ts", commandFileContents);
}

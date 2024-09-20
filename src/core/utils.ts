import path from "path";
import noindentLib from "noindent";
import handlebars from "handlebars";
import * as log from "./log.js";
import * as ask from "./ask.js";

export * as node from "./node.js";
export * as changeCase from "change-case";

export const noindent = noindentLib.default;

export const runScript = async (script: string, options?: Record<string, any> & { arguments?: string[] }) => {
  const resolvedScript = [`${script}`, `${script}/index`].find(
    (s) =>
      global.fs.existsSync(path.join(global.scriptsRoot, `${s}.ts`)) ||
      global.fs.existsSync(path.join(global.scriptsRoot, `${s}.js`))
  );

  if (!resolvedScript) {
    log.exit(`Could not find script ${script}`);
  }

  const oldArguments = global.args;

  log.info(`Running: ${resolvedScript}`);

  global.args = { ...oldArguments, ...options, _: options?.arguments ?? options?._ ?? [] };
  try {
    await import(`../scripts/${resolvedScript}.js`);
  } catch (e) {
    log.error(`Invocation of script ${script} failed.`);
    log.error(
      `This might have been a sub-script, and not the originally called script. Rerun script with the following command:`
    );
    // eslint-disable-next-line no-underscore-dangle
    log.muted(`  ${ask._rebuildCommand(script as string)}`);
    throw e;
  }
  global.args = oldArguments;
};

export const replaceTemplateText = (template: string, vars: Record<string, any>) => {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
    return vars[key];
  });
};

export const cd = (dir: string) => {
  log.muted(`cd ${dir}`);
  process.chdir(dir);
};

export const amendFile = async (file: string, amend: (content: string) => string | Promise<string>) => {
  const content = (await global.fs.exists(file)) ? await global.fs.readFile(file, "utf-8") : "";
  const newContent = await amend(content);
  await global.fs.writeFile(file, newContent);
};

export const maybeReadTextFile = async (file: string) => fs.readFile(file, "utf-8").catch(() => null);

export const goUpTree = async (checkDir: (dir: string) => Promise<boolean> | boolean, startDir = process.cwd()) => {
  let dir = startDir;
  while (true) {
    if (await checkDir(dir)) {
      return dir;
    }
    const nextDir = path.join(dir, "..");
    if (nextDir === dir) {
      return false;
    }
    dir = nextDir;
  }
};

export const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

export const isNotNull = <T>(x: T | null): x is T => x !== null;

export const getShortcutsFile = () => {
  return path.join(os.homedir(), ".ldo-shortcuts.json");
};

export const loadTemplate = (template: string, options?: any) => {
  const file = path.join(global.scriptsRoot, "../../templates", template);
  const contents = global.fs.readFileSync(file, "utf-8");
  const templateFunc = handlebars.compile(contents);
  return templateFunc(options ?? {});
};

export const getSafeFilename = (filename: string, extension?: string) => {
  return filename.replace(/[^a-z0-9]/gi, "_") + (extension ? `.${extension}` : "");
};

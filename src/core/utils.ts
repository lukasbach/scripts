/* eslint-disable no-underscore-dangle */
import path from "path";
import noindentLib from "noindent";
import handlebars from "handlebars";
import { z } from "zod";
import * as log from "./log.js";
import * as ask from "./ask.js";

export * as node from "./node.js";
export * as changeCase from "change-case";
export * as exif from "./exif.js";

export const noindent = noindentLib.default;

export const runScript = async (script: string, options?: Record<string, any> & { arguments?: string[] }) => {
  const resolvedScript = [`${script}`, `${script}/index`].find(
    (s) =>
      global.fs.existsSync(path.join(global.scriptsRoot, `${s}.ts`)) ||
      global.fs.existsSync(path.join(global.scriptsRoot, `${s}.js`))
  );

  if (!resolvedScript) {
    const unnameds = global.args._.map((a) => `"${a}"`).join(" ");
    const nameds = Object.entries(global.args)
      .filter(([k]) => k !== "_")
      .map(([k, v]) => {
        const key = k.length === 1 ? `-${k}` : `--${k}`;
        const value = v === true ? "" : `"${v}"`;
        return `${key} ${value}`;
      })
      .join(" ");
    try {
      await $({ stdio: "inherit" })`${script} ${unnameds} ${nameds}`;
      return;
    } catch (e) {
      log.error(
        `Script ${script} not found, and running ${script} as global script yielded an error. Run as verbose for details.`
      );
      log.info(`ran: ${script} ${unnameds} ${nameds}`);
      log.verbose(e);
      process.exit(1);
    }
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

export const remapObject = <T>(original: any, matcher: z.ZodType<T>, replacer: (previous: T) => any) => {
  const parsed = matcher.safeParse(original);
  if (parsed.success) {
    return replacer(parsed.data);
  }

  if (!original) return original;

  if (Array.isArray(original)) {
    return original.map((item) => remapObject(item, matcher, replacer));
  }

  if (typeof original === "object") {
    return Object.fromEntries(
      Object.entries(original).map(([key, value]) => [key, remapObject(value, matcher, replacer)])
    );
  }

  return original;
};

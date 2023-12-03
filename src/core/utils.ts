import path from "path";

export * as node from "./node.js";

export const runScript = async (script: string) => {
  const resolvedScript = [`${script}`, `${script}/index`].find(
    (s) =>
      global.fs.existsSync(path.join(global.scriptsRoot, `${s}.ts`)) ||
      global.fs.existsSync(path.join(global.scriptsRoot, `${s}.js`))
  );

  if (!resolvedScript) {
    throw new Error(`Could not find script ${script}`);
  }

  await import(`../scripts/${resolvedScript}.js`);
};

export const replaceTemplateText = (template: string, vars: Record<string, any>) => {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
    return vars[key];
  });
};

export const cd = (dir: string) => {
  process.chdir(dir);
};

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

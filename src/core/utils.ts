export * as node from "./node.js";

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

import inquirer from "inquirer";

let argCounter = 0;

const getFromArgs = (keys: string): any | undefined => {
  for (const key of keys.split(",")) {
    if (key === "_") {
      argCounter++;
      return args._[argCounter - 1];
    }
    if (args[key]) {
      return args[key];
    }
  }
  return undefined;
};

export const text = async (keys: string, message: string, defaultValue?: string): Promise<string> => {
  return getFromArgs(keys) ?? (await inquirer.prompt({ message, default: defaultValue, name: "v" })).v;
};

export const choice = async <T extends string>(
  keys: string,
  message: string,
  choices: T[],
  defaultValue?: string
): Promise<T> => {
  return (
    getFromArgs(keys) ?? (await inquirer.prompt({ type: "list", message, default: defaultValue, choices, name: "v" })).v
  );
};

export const confirm = async (message: string, defaultValue?: string): Promise<boolean> => {
  return (
    getFromArgs("y,yes") ?? (await inquirer.prompt({ type: "confirm", message, default: defaultValue, name: "v" })).v
  );
};

export const number = async (keys: string, message: string, defaultValue?: string): Promise<number> => {
  return getFromArgs(keys) ?? (await inquirer.prompt({ type: "number", message, default: defaultValue, name: "v" })).v;
};

export const editor = async (keys: string, message: string, defaultValue?: string): Promise<string> => {
  return getFromArgs(keys) ?? (await inquirer.prompt({ type: "editor", message, default: defaultValue, name: "v" })).v;
};

import inquirer, { DistinctChoice } from "inquirer";

let argCounter = 0;

const getFromArgs = (keys: string): any | undefined => {
  for (const key of keys.split(",")) {
    if (key === "_") {
      argCounter++;
      log.verbose(`Arg ${argCounter - 1} is "${args._[argCounter - 1]}"`);
      return args._[argCounter - 1];
    }
    if (args[key]) {
      log.verbose(`Arg ${key} is "${args[key]}"`);
      return args[key];
    }
  }
  log.verbose(`Arg ${keys} not found in args`);
  return undefined;
};

export const text = async (keys: string, message: string, defaultValue?: string): Promise<string> => {
  return getFromArgs(keys) ?? (await inquirer.prompt({ message, default: defaultValue, name: "v" })).v;
};

export const path = async (
  keys: string,
  message: string,
  defaultValue?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fileExtensions?: string[]
): Promise<string> => {
  // TODO
  return getFromArgs(keys) ?? (await inquirer.prompt({ message, default: defaultValue, name: "v" })).v;
};

export const choice = async <T extends string = string>(
  keys: string,
  message: string,
  choices: Array<DistinctChoice>,
  defaultValue?: string
): Promise<T> => {
  return (
    getFromArgs(keys) ??
    (
      await inquirer.prompt({
        type: "autocomplete",
        message,
        default: defaultValue,
        choices,
        source: (_, input) =>
          choices.filter((c) => {
            if (!input) {
              return true;
            }
            if (typeof c === "string") {
              return c.toLowerCase().includes(input.toLowerCase());
            }
            if ("name" in c && c.name) {
              return c.name.toLowerCase().includes(input.toLowerCase());
            }
            if ("value" in c && c.value) {
              return c.value.toLowerCase().includes(input.toLowerCase());
            }
            return false;
          }),
        name: "v",
      } as any)
    ).v
  );
};

export const confirm = async (message: string, defaultValue?: string): Promise<boolean> => {
  return (
    getFromArgs("y,yes") ?? (await inquirer.prompt({ type: "confirm", message, default: defaultValue, name: "v" })).v
  );
};

export const bool = async (keys: string, message: string, defaultValue?: string): Promise<boolean> => {
  return (
    getFromArgs(keys) ??
    (
      await inquirer.prompt({
        type: "list",
        message,
        default: defaultValue,
        choices: ["Yes", "No"],
        name: "v",
      } as any)
    ).v === "Yes"
  );
};

export const number = async (keys: string, message: string, defaultValue?: string): Promise<number> => {
  return getFromArgs(keys) ?? (await inquirer.prompt({ type: "number", message, default: defaultValue, name: "v" })).v;
};

export const editor = async (keys: string, message: string, defaultValue?: string): Promise<string> => {
  return getFromArgs(keys) ?? (await inquirer.prompt({ type: "editor", message, default: defaultValue, name: "v" })).v;
};

import inquirer, { DistinctChoice } from "inquirer";
import pathLib from "path";

let argCounter = 0;
const registeredAnswers: Record<string, any> = { _: [] };

const getFromArgs = (keys: string | null): any | undefined => {
  if (!keys) {
    return undefined;
  }

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

const registerAnswer = (keys: string | null, value: string): void => {
  if (!keys) {
    return;
  }

  const key = keys.split(",").sort((a, b) => a.length - b.length)[0];
  if (key === "_") {
    registeredAnswers._.push(value);
    return;
  }
  registeredAnswers[key] = value;
};

// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
export const _rebuildCommand = (cmdName: string) => {
  const keys = Object.keys(registeredAnswers).filter((k) => k !== "_");
  const args = keys.map((k) => {
    if (registeredAnswers[k] === false) return "";
    const value = registeredAnswers[k] === true ? "" : registeredAnswers[k];
    return `-${k.length > 1 ? "-" : ""}${k} ${value}`;
  });
  return `ldo ${cmdName} ${registeredAnswers._.join(" ")} ${args.join(" ")}`;
};

export const text = async (keys: string | null, message: string, defaultValue?: string): Promise<string> => {
  const value = getFromArgs(keys) ?? (await inquirer.prompt({ message, default: defaultValue, name: "v" })).v;
  registerAnswer(keys, value);
  return value;
};

export const password = async (keys: string | null, message: string, defaultValue?: string): Promise<string> => {
  const value =
    getFromArgs(keys) ?? (await inquirer.prompt({ type: "password", message, default: defaultValue, name: "v" })).v;
  registerAnswer(keys, value);
  return value;
};

export const path = async (
  keys: string,
  message: string,
  defaultValue?: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fileExtensions?: string[]
): Promise<string> => {
  // TODO
  const value = getFromArgs(keys) ?? (await inquirer.prompt({ message, default: defaultValue, name: "v" })).v;
  registerAnswer(keys, value);
  return pathLib.resolve(value);
};

export const choice = async <T extends string = string>(
  keys: string | null,
  message: string,
  choices: Array<DistinctChoice>,
  defaultValue?: string
): Promise<T> => {
  const value =
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
    ).v;
  registerAnswer(keys, value);
  return value;
};

export const multiChoice = async <T extends string = string>(
  keys: string | null,
  message: string,
  choices: Array<DistinctChoice>,
  defaultValue?: string
): Promise<T[]> => {
  const value =
    getFromArgs(keys)?.split(",") ??
    (
      await inquirer.prompt({
        type: "checkbox",
        message,
        default: defaultValue,
        choices,
        name: "v",
      } as any)
    ).v;
  registerAnswer(keys, value.join(","));
  return value;
};

export const confirm = async (message: string, defaultValue?: string): Promise<boolean> => {
  return (
    getFromArgs("y,yes") ?? (await inquirer.prompt({ type: "confirm", message, default: defaultValue, name: "v" })).v
  );
};

export const bool = async (keys: string, message: string, defaultValue?: boolean): Promise<boolean> => {
  const value =
    getFromArgs(keys) ??
    (
      await inquirer.prompt({
        type: "list",
        message,
        default: defaultValue,
        choices: ["Yes", "No"],
        name: "v",
      } as any)
    ).v === "Yes";
  registerAnswer(keys, value);
  return value;
};

export const number = async (keys: string, message: string, defaultValue?: string): Promise<number> => {
  const v =
    getFromArgs(keys) ?? (await inquirer.prompt({ type: "number", message, default: defaultValue, name: "v" })).v;
  registerAnswer(keys, v);
  return parseFloat(v);
};

export const editor = async (keys: string, message: string, defaultValue?: string): Promise<string> => {
  const value =
    getFromArgs(keys) ?? (await inquirer.prompt({ type: "editor", message, default: defaultValue, name: "v" })).v;
  registerAnswer(keys, value);
  return value;
};

import inquirer from "inquirer";

const questionsAsked: string[] = [];

export const text = async (message: string, defaultValue?: string): Promise<string> => {
  questionsAsked.push(message);
  return (await inquirer.prompt({ message, default: defaultValue, name: "v" })).v;
};

export const choice = async <T extends string>(message: string, choices: T[], defaultValue?: string): Promise<T> => {
  questionsAsked.push(message);
  return (await inquirer.prompt({ type: "list", message, default: defaultValue, choices, name: "v" })).v;
};

export const confirm = async (message: string, defaultValue?: string): Promise<boolean> => {
  questionsAsked.push(message);
  return (await inquirer.prompt({ type: "confirm", message, default: defaultValue, name: "v" })).v;
};

export const number = async (message: string, defaultValue?: string): Promise<number> => {
  questionsAsked.push(message);
  return (await inquirer.prompt({ type: "number", message, default: defaultValue, name: "v" })).v;
};

export const editor = async (message: string, defaultValue?: string): Promise<string> => {
  questionsAsked.push(message);
  return (await inquirer.prompt({ type: "editor", message, default: defaultValue, name: "v" })).v;
};

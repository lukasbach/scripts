import { execaCommand } from "execa";

const cmd = `yarn add @types/deepmerge --dev`;
await execaCommand(cmd, { verbose: true });

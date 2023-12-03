/** Pins the LTS version of Node.js and latest version of the currently active package manager in use with Volta. */

await utils.cd(await utils.node.getPackageRoot());
await $`volta pin node@lts`;

switch (await utils.node.getPackageManager()) {
  case "yarn":
    await $`volta pin yarn@latest`;
    break;
  case "pnpm":
    await $`volta pin pnpm@latest`;
    break;
  case "npm":
    await $`volta pin npm@latest`;
    break;
  default:
    break;
}

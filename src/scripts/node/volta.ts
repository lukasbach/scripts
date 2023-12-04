/** Pins the LTS version of Node.js and latest version of the currently active package manager in use with Volta. */

await utils.cd(await utils.node.getPackageRoot());
await $`volta pin node@lts`;
await $`volta pin ${await utils.node.getPackageManager()}@latest`;

/** Runs various npm scripts that typically exist for verification purposes, such as build, test and lint. */

await utils.cd(await utils.node.getPackageRoot());
await utils.node.runScript("build --if-present");
await utils.node.runScript("build:ci --if-present");
await utils.node.runScript("lint --if-present");
await utils.node.runScript("lint:ci --if-present");
await utils.node.runScript("lint:test --if-present");
await utils.node.runScript("test --if-present");
await utils.node.runScript("test:ci --if-present");

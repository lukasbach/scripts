import { glob } from "glob";

const files = await glob(path.join(await utils.node.getPackageRoot(), "src/**/*.{ts,tsx,js}"));

for (const file of files) {
  const content = await fs.readFile(file, "utf-8");
  let count = 0;
  const newContent = content.replace(/from\s+['"]([^'"]+)['"]/g, (_, importPath) => {
    if (!importPath.startsWith(".")) {
      return `from "${importPath}"`;
    }

    count++;

    if (importPath.endsWith(".ts") || importPath.endsWith(".tsx")) {
      return `from "${importPath.slice(0, -3)}.js"`;
    }

    return `from "${importPath}.js"`;
  });
  await fs.writeFile(file, newContent, "utf-8");
  log.info(`Updated ${file} (${count} replacements)`);
}

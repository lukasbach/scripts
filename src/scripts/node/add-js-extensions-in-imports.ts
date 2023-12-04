/**
 * Replaces all imports in the nodejs package to include .js file extensions. Ignores imports of packages (i.e.
 * non-relative imports), and imports of non-code files. This is part of the the adoption process for ESM builds.
 */

const matcher = path.join(await utils.node.getPackageRoot(), "src/**/*.{ts,tsx,js}").replace(/\\/g, "/");
const files = await glob(matcher);

for (const file of files) {
  const content = await fs.readFile(file, "utf-8");
  let count = 0;
  const newContent = content.replace(/from\s+['"]([^'"]+)['"]/g, (_, importPath) => {
    const ext = path.extname(importPath);

    if (!importPath.startsWith(".") || (ext && ext !== ".ts" && ext !== ".tsx")) {
      return `from "${importPath}"`;
    }

    count++;

    if (ext === ".ts" || ext === ".tsx") {
      return `from "${importPath.slice(0, -ext.length)}.js"`;
    }

    return `from "${importPath}.js"`;
  });
  await fs.writeFile(file, newContent, "utf-8");
  if (count > 0) {
    log.info(`Updated ${file} (${count} replacements)`);
  } else {
    log.verbose(`No changes in file ${file}`);
  }
}

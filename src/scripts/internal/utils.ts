/** @internal */

import { TSDocParser, DocNode, DocExcerpt } from "@microsoft/tsdoc";
import deepmerge from "deepmerge";

export class Formatter {
  public static renderDocNode(docNode: DocNode): string {
    let result: string = "";
    if (docNode) {
      if (docNode instanceof DocExcerpt) {
        result += docNode.content.toString();
      }
      for (const childNode of docNode.getChildNodes()) {
        result += Formatter.renderDocNode(childNode);
      }
    }
    return result;
  }

  public static renderDocNodes(docNodes: ReadonlyArray<DocNode>): string {
    let result: string = "";
    for (const docNode of docNodes) {
      result += Formatter.renderDocNode(docNode);
    }
    return result;
  }
}

export const getScriptPaths = async () => {
  utils.cd(await utils.node.getPackageRoot());
  let scripts = await glob("src/scripts/**/*.ts");
  scripts = scripts.filter(
    (s) => !scripts.includes(path.join(path.dirname(s), "index.ts")) || path.basename(s) === "index.ts"
  );
  return scripts;
};

export const resolveScriptData = async (scripts: string[]) => {
  const scriptDataArray = (
    await Promise.all(
      scripts.map(async (script) => {
        const code = await fs.readFile(script, "utf-8");
        const tsdocParser = new TSDocParser();
        const parserContext = tsdocParser.parseString(code);

        const summary = Formatter.renderDocNodes(parserContext.docComment.summarySection.nodes);
        const commands = [...code.matchAll(/\$`([^`]*)`/g)].map((t) => t[1]);
        const questions = [
          ...code.matchAll(/ask.(?!confirm)[^(]*\(\s*["'`]([^"'`]+)["'`],\s*["'`]([^"'`]+)["'`]/g),
        ].map((t) => ({
          keys: t[1].split(","),
          question: t[2],
        }));
        const imports = [...code.matchAll(/utils.runScript\(\s*["'`]([^"'`]+)["'`]\s*\)/g)].map((t) => t[1]);
        const command = script
          .replace(/\\/g, "/")
          .replace(/^src\/scripts\//, "")
          .replace(/\.ts$/, "")
          .replace(/\/index$/, "");
        return {
          script,
          summary,
          commands,
          questions,
          imports,
          command,
          code,
          isInternal: parserContext.docComment.modifierTagSet.isInternal(),
        };
      })
    )
  ).filter(utils.isNotNull);
  const scriptData = scriptDataArray.reduce(
    (acc, cur) => ({ ...acc, [cur.command]: cur }),
    {} as Record<string, (typeof scriptDataArray)[number]>
  );
  const resolveImports = (command: string) => {
    const data = scriptData[command];
    return deepmerge.all([...data.imports.flatMap(resolveImports), data]);
  };

  for (const command of Object.keys(scriptData)) {
    scriptData[command] = resolveImports(command);
  }
  return scriptData;
};

export type ScriptData = Awaited<ReturnType<typeof resolveScriptData>>[string];

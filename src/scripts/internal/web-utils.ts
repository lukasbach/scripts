/** @internal */
import { ScriptData } from "./utils.js";
import { defaultShortcuts } from "../../core/shortcuts.js";

export const getScriptPageMd = (script: ScriptData) => {
  const questionRows = script.options
    .map(({ question, keys }) => {
      const keyString = keys
        .sort((a, b) => b.length - a.length)
        .map((k) => (k.length === 1 ? `\`-${k}\`` : `\`--${k}\``))
        .join(", ");
      return `- ${keyString}: ${question}`;
    })
    .join("\n");
  const argsRows = script.args.map(({ question }, i) => `- \`[${i}]\`: ${question}`).join("\n");
  const commandSplit = script.command.split("/");

  let content = `---\nsidebarTitle: ${commandSplit[commandSplit.length - 1]}\n---\n\n`;
  content += `# ${script.command}\n\n${script.summary}\n\n`;
  content += `## Usage\n\n\`\`\`bash\nnpx @lukasbach/scripts ${script.command}\n\`\`\`\n\n`;
  content += `You can call the script directly if you have installed it globally:\n\n`;
  content += `\`\`\`bash\nnpm i -g @lukasbach/scripts\nldo ${script.command}\n\`\`\`\n\n`;

  const shortcuts = Object.entries(defaultShortcuts).find(([, value]) => value === script.command);
  if (shortcuts) {
    content += `There is a default shortcut for this script: \`ldo ${shortcuts[0]}\`\n\n`;
    content += `You can customize shortcuts with \`ldo edit-shortcuts\`.\n\n`;
  }

  if (script.args.length > 0) {
    content += `## Arguments\n\n${argsRows}\n\n`;
  }
  content += `## Options\n\n${questionRows}`;
  content += `\n- \`-v\`, \`--verbose\`: Verbose logging\n\n`;
  content += `You can also omit options, and will be asked for them interactively.\n\n`;
  content += `Add \`--yes\` to skip all confirmations.\n\n`;
  if (script.imports.length > 0) {
    content += `## Referenced scripts\n\n${script.imports.map((i) => `- [\`${i}\`](/${i})`).join("\n")}\n\n`;
  }

  const sourceLink = `[View Source on GitHub](https://github.com/lukasbach/scripts/blob/main/src/scripts/${script.command}.ts)\n`;

  content += `## Script source\n\n${sourceLink}\`\`\`typescript\n${script.code}\n\`\`\`\`\n\n`;

  return content;
};

export const getShortcutsMd = () => {
  const shortcuts = Object.entries(defaultShortcuts)
    .map(([shortcut, script]) => {
      return `- \`ldo ${shortcut}\`: [\`${script}\`](/${script})`;
    })
    .join("\n");
  return (
    `# Shortcuts\n\n` +
    `The following shortcuts are available for commands that are more commonly used.\n\n` +
    `You can customize shortcuts with \`ldo edit-shortcuts\`\n\n` +
    `${shortcuts}\n\n` +
    `You can also add other global commands to the shortcuts file. For example, ` +
    `adding the shortcut \`npm run build:ci\` as \`npmb\`, then calling \`ldo npmb --verbose\` will call \`npm run build:ci --verbose\`.`
  );
};

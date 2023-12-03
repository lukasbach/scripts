/** @internal */
import * as marked from "marked";
import { ScriptData } from "./utils.js";

export const getSidebarHtml = (scripts: ScriptData[]): string => {
  const scriptLinks = scripts
    .filter((script) => !script.isInternal)
    .map((script) => {
      return `<li><a href="/${script.command}">${script.command}</a></li>`;
    })
    .join("\n");

  return (
    `<a href="/"><div class="sidebar-head">@lukasbach/scripts</div></a><ul>${scriptLinks}</ul>` +
    `<ul><li><a target="_blank" href="https://github.com/lukasbach/scripts">GitHub Repo</a></li>` +
    `<li><a target="_blank" href="https://lukasbach.com">lukasbach.com</a></li></ul>`
  );
};

export const getScriptPageHtml = (script: ScriptData) => {
  const questionRows = script.options
    .map(({ question, keys }) => {
      const keyString = keys
        .sort((a, b) => b.length - a.length)
        .map((k) => (k.length === 1 ? `-${k}` : `--${k}`))
        .join(", ");
      return `<li>${keyString}: ${question}</li>`;
    })
    .join("\n");
  const argsRows = script.args.map(({ question }, i) => `<li>[${i}]: ${question}</li>`).join("\n");

  let content = `<h1>${script.command}</h1><p>${marked.parse(script.summary)}</p>`;
  content += `<h2>Usage</h2><pre><code>npx @lukasbach/scripts ${script.command}</code></pre>`;
  content += `<p>You can call the script directly if you have installed it globally:</p>`;
  content += `<pre><code>npm i -g @lukasbach/scripts\nldo ${script.command}</code></pre>`;

  if (script.args.length > 0) {
    content += `<h2>Arguments</h2><ul>${argsRows}</ul>`;
  }
  if (script.options.length > 0) {
    content += `<h2>Options</h2><ul>${questionRows}</ul>`;
    content += `<p>You can also omit options, and will be asked for them interactively.</p>`;
    content += `<p>Add <code>--yes</code> to skip all confirmations.</p>`;
  }
  if (script.imports.length > 0) {
    content += `<h2>Referenced scripts</h2><ul>${script.imports
      .map((i) => `<li><a href="${i}"><code>${i}</code></a></li>`)
      .join("\n")}</ul>`;
  }

  content += `<h2>Script source</h2><pre><code>${script.code}</code></pre>`;

  return content;
};

export const getContainerHtml = (allScripts: ScriptData[], title: string, content: string) => {
  return `<html>
  <head>
    <title>${title}</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="sidebar">
      ${getSidebarHtml(allScripts)}
    </div>
    <div class="content">
      <div class="inner">
        ${content}
      </div>
    </div>
  </body>
</html>`;
};

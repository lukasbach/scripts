/** Creates a React Functional Component without any props. */

const componentName = await ask.text("_", "React component name", "MyComponent");
const content = utils.noindent(`
  import { FC } from "react";
  
  export const ${utils.changeCase.pascalCase(componentName)}: FC = () => (
      <>
        hello
      </>
    );
  `);

await fs.writeFile(path.join(process.cwd(), `${utils.changeCase.kebabCase(componentName)}.tsx`), content);

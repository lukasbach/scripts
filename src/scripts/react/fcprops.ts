/** Creates a React Functional Component with dedicated props type. */

const componentName = await ask.text("_", "React component name", "MyComponent");
const pascalName = utils.changeCase.pascalCase(componentName);
const content = utils.noindent(`
  import { FC } from "react";

  type ${pascalName}Props = {};
  
  export const ${pascalName}: FC<${pascalName}Props> = ({}) => {
    return (
      <>
        hello
      </>
    );
  };
  `);

await fs.writeFile(path.join(process.cwd(), `${utils.changeCase.kebabCase(componentName)}.tsx`), content);

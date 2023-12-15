/** Creates a React Functional Component with a PropsWithChildren prop type. */

const componentName = await ask.text("_", "React component name", "MyComponent");
const content = utils.noindent(`
  import { FC, PropsWithChildren } from "react";
  
  export const ${utils.changeCase.pascalCase(componentName)}: FC<PropsWithChildren<{}>> = ({}) => {
    return (
      <>
        hello
      </>
    );
  };
  `);

await fs.writeFile(path.join(process.cwd(), `${utils.changeCase.kebabCase(componentName)}.tsx`), content);

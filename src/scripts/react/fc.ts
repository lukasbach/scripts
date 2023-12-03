const componentName = await ask.text("[0]", "React component name", "MyComponent");
const content = utils.noindent(`
  import { FC } from "react";
  
  export const ${utils.changeCase.pascalCase(componentName)}: FC<{}> = ({}) => {
    return (
      <>
        hello
      </>
    );
  };
  `);

await fs.writeFile(path.join(process.cwd(), `${utils.changeCase.kebabCase(componentName)}.tsx`), content);

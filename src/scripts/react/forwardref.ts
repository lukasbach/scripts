/** Creates a React Functional Component using forwardRef. */

const componentName = await ask.text("_", "React component name", "MyComponent");
const pascalName = utils.changeCase.pascalCase(componentName);
const content = utils.noindent(`
  import { forwardRef } from "react";
  
  type ${pascalName}Props = {};
  
  export const ${pascalName} = forwardRef<HTMLDivElement, ${pascalName}Props>(({}, ref) => {
    return (
      <div ref={ref}>
        hello
      </div>
    );
  }
  `);

await fs.writeFile(path.join(process.cwd(), `${utils.changeCase.kebabCase(componentName)}.tsx`), content);

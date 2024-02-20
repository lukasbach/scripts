/** Template for a vitest test suite file for a logic component. */

const testName = await ask.text("_", "Name of the tested component", "MyComponent");

const pascal = utils.changeCase.pascalCase(testName);
const kebab = utils.changeCase.kebabCase(testName);

const content = utils.noindent(`
  import { describe, expect, it } from "vitest";
  import { ${pascal} } from "./${kebab}";
  
  describe("${kebab}", () => {
    it("should work", () => {
      expect(() => ${pascal}())).toEqual(123);
    });
  });`);

await fs.writeFile(path.join(process.cwd(), `${kebab}.spec.tsx`), content);

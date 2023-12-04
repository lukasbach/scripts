/** Template for a react-based vitest test suite file for testing a component. */

const testName = await ask.text("_", "Name of the tested component", "MyComponent");

const pascal = utils.changeCase.pascalCase(testName);
const kebab = utils.changeCase.kebabCase(testName);

const content = utils.noindent(`
  import { describe, expect, it } from "vitest";
  import { render } from "@testing-library/react";
  import { ${pascal} } from "./${kebab}";

  describe("${kebab}", () => {
    it("should render", () => {
      const { getByText } = render(<${pascal} />);
      expect(getByText("hello")).toBeInTheDocument();
    });
  });`);

await fs.writeFile(path.join(process.cwd(), `${kebab}.spec.tsx`), content);

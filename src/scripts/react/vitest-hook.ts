/** Template for a react-based vitest test suite file for testing a react hook. */

const testName = await ask.text("_", "Name of the tested hook", "useHook");

const pascal = utils.changeCase.pascalCase(testName);
const kebab = utils.changeCase.kebabCase(testName);

const content = utils.noindent(`
  import { describe, expect, it } from "vitest";
  import { renderHook } from "@testing-library/react";
  import { ${pascal} } from "./${kebab}";
  
  describe("${kebab}", () => {
    it("should render", () => {
      const { result } = renderHook(() => ${pascal}()));
      expect(result.current.value).toBe("hello");
    });
  });`);

await fs.writeFile(path.join(process.cwd(), `${kebab}.spec.tsx`), content);

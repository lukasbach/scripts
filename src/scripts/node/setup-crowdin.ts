/** Sets up a crowdin-based translation configuration for the current project. */

const target = await ask.text("target,t", "Where should the translation files be stored?", "src/assets/i18n");
const languages = await ask.text("lang,-l", "Which languages should be translated to?", "de,es,fr,it,pt");
const createTest = await ask.confirm("Should a vitest based test suite be created?"); // TODO yesno

await fs.ensureDir(path.join(await utils.node.getPackageRoot(), target));
await fs.ensureDir(path.join(await utils.node.getPackageRoot(), "src"));

await utils.node.addDependency("i18next");
await utils.node.addDevDependency("i18next-parser");
await utils.node.amendPackageJson({ scripts: { "i18n:create-keys": "i18next" } });

await fs.writeFile(
  path.join(await utils.node.getPackageRoot(), "crowdin.yaml"),
  utils.noindent(`
    pull_request_title: "chore: new Crowdin translation"
    pull_request_labels:
      - translations
    files:
      - source: ${target}/en.json
        translation: ${target}/%two_letters_code%.json`)
);

await fs.writeFile(
  path.join(await utils.node.getPackageRoot(), "i18next-parser.config.js"),
  utils.noindent(`
    // eslint-disable-next-line import/no-default-export
    export default {
      lineEnding: "lf",
      locales: ["en"],
      input: ["src/**/*.{ts,tsx}"],
      output: "${target}/$LOCALE.json",
    };`)
);

await fs.writeFile(
  path.join(await utils.node.getPackageRoot(), "src/i18n.ts"),
  utils.noindent(`
    import { use } from "i18next";
    import { initReactI18next } from "react-i18next";
    ${languages
      .split(",")
      .map((lang) => `import ${lang} from "../${target}/${lang}.json";`)
      .join("\n")}
    import { useRef } from "react";
    
    const getShortLanguage = (language: string) => language.split("-")[0];
    
    const setupI18n = (language: string) =>
      use(initReactI18next).init({
        resources: {
          ${languages
            .split(",")
            .map((lang) => `${lang}: { root: ${lang} },`)
            .join("\n")}
        },
        lng: getShortLanguage(language),
        defaultNS: "root",
      });
    
    export const useSetupI18n = (language = "en-US") => {
      const isSetup = useRef(false);
      if (isSetup.current) {
        return;
      }
      isSetup.current = true;
      setupI18n(language);
    };
    `)
);

if (createTest) {
  await fs.writeFile(
    path.join(await utils.node.getPackageRoot(), "src/i18n.spec.ts"),
    utils.noindent(`
    import { renderHook } from "@testing-library/react";
    import { useSetupI18n } from "./i18n";
    import { describe, expect, it, vi } from "vitest";
    import { use } from "i18next";
    
    vi.mock("i18next");
    vi.mock("react-i18next");
    
    describe("i18n", () => {
      const init = vi.fn();
      (use as any).mockImplementation(() => ({
        init,
      }));
    
      it("sets up i18n with hook", () => {
        renderHook(() => useSetupI18n());
    
        expect(init).toHaveBeenCalledWith({
          resources: expect.anything(),
          lng: "en",
          defaultNS: "root",
        });
      });
    });`)
  );
}

await utils.node.runScript("i18n:create-keys");

log.info(`Done. Please add "useSetupI18n(language);" to your App.tsx file.`);

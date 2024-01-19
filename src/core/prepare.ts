import handlebars from "handlebars";

export const prepareHandlebars = () => {
  handlebars.registerHelper("noCase", (str) => utils.changeCase.noCase(str));
  handlebars.registerHelper("camelCase", (str) => utils.changeCase.camelCase(str));
  handlebars.registerHelper("pascalCase", (str) => utils.changeCase.pascalCase(str));
  handlebars.registerHelper("pascalSnakeCase", (str) => utils.changeCase.pascalSnakeCase(str));
  handlebars.registerHelper("capitalCase", (str) => utils.changeCase.capitalCase(str));
  handlebars.registerHelper("constantCase", (str) => utils.changeCase.constantCase(str));
  handlebars.registerHelper("dotCase", (str) => utils.changeCase.dotCase(str));
  handlebars.registerHelper("kebabCase", (str) => utils.changeCase.kebabCase(str));
  handlebars.registerHelper("pathCase", (str) => utils.changeCase.pathCase(str));
  handlebars.registerHelper("sentenceCase", (str) => utils.changeCase.sentenceCase(str));
  handlebars.registerHelper("snakeCase", (str) => utils.changeCase.snakeCase(str));
  handlebars.registerHelper("trainCase", (str) => utils.changeCase.trainCase(str));
};

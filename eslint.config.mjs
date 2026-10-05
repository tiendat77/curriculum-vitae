import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";

export default [
  { ignores: [".husky", ".vscode", "node_modules", "public", "dist", ".astro"] },
  js.configs.recommended,
  ...astro.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: { parser: tsParser, extraFileExtensions: [".astro"] },
    },
  },
];

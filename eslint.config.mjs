import globals from "globals";

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import stylisticPluginJS from "@stylistic/eslint-plugin-js";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

export default [
  {
    ignores: ["dist/", "eslint.config.mjs"],
  },
  { languageOptions: { globals: globals.browser } },
  ...compat.extends("standard"),
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
    plugins: {
      "@stylistic/js": stylisticPluginJS,
    },
    rules: {
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": ["error", "windows"],
      "@stylistic/js/quotes": ["error", "double"],
      "@stylistic/js/semi": ["error", "always"],
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "comma-dangle": ["error", "only-multiline"],
    },
  },
];

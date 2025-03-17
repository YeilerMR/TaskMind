import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  //pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      // quotes: ["error", "single", { avoidEscape: true }],
      semi: ["error", "always"],
      "prettier/prettier": [
        "error",
        {
          semi: true,
          bracketSpacing: true,
          arrowParens: "always",
          printWidth: 80,
          endOfLine: "lf",
          singleQuote: true,
        },
      ],
    },
  },
];

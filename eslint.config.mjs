import globals from "globals";
import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
    plugins: {
      import: importPlugin
    },
    rules: {
      "import/no-unresolved": "error", // Detecta imports incorrectos
      "import/named": "error",         // Asegura que los nombres importados existen en el módulo
      "import/default": "error",       // Verifica imports por defecto
      "import/no-extraneous-dependencies": "error", // Evita usar paquetes que no están en package.json
    },
  },
];

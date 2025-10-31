// eslint.config.mjs
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  // JS + TS recommended presets (flat config)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Your project rules (apply to src files)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["node_modules/**", ".next/**", "dist/**", "out/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "@next/next": nextPlugin,
    },
    // Use Next.js Core Web Vitals rules
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];

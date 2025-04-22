import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable rule for unescaped entities in JSX
      "react/no-unescaped-entities": "off",

      // Disable rule for missing dependencies in React hooks
      "react-hooks/exhaustive-deps": "off",

      // Disable rule for <img> usage instead of <Image>
      "@next/next/no-img-element": "off",

      // Disable rule for missing alt text in images
      "jsx-a11y/alt-text": "off",

      // Allow the use of 'any' in TypeScript
      "@typescript-eslint/no-explicit-any": "off",

      // Disable unused ESLint directive warnings
      "no-unused-disable-directive": "off",
    },
  },
];

export default eslintConfig;

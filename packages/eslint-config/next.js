const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    // Very strict, especially @vercel/style-guide/eslint/typescript. Might be good to use this in the future.
    // ...[
    //   "@vercel/style-guide/eslint/node",
    //   "@vercel/style-guide/eslint/typescript",
    //   "@vercel/style-guide/eslint/browser",
    //   "@vercel/style-guide/eslint/react",
    //   "@vercel/style-guide/eslint/next",
    // ].map(require.resolve),
    // "turbo",

    // Default Turbo next eslint config START
    "eslint:recommended",
    "prettier",
    require.resolve("@vercel/style-guide/eslint/next"),
    "turbo",
    // Default Turbo next eslint config END
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
      node: {
        extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
  },
};

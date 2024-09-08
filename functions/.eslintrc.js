module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {allowTemplateLiterals: true}],
    "semi": ["error", "always"],
    "indent": ["error", 2],
    "max-len": "off",
    "quote-props": ["error", "consistent"],
    "object-curly-spacing": ["error", "never"],
  },
  overrides: [
    {
      files: ["**/functions/**/*.js"],
      env: {
        node: true,
      },
      rules: {
        "indent": ["error", 2],
        "max-len": ["error", {code: 120}],
      },
    },
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};

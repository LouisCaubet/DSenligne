module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
  ],
  rules: {
    quotes: ["error", "double"],
  },
  parserOptions: {
    ecmaVersion: 8,
  },
};

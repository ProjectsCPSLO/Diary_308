module.exports = {
    env: {
      node: true,
      jest: true,
      es6: true,
    },
    extends: ['eslint:recommended'],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    ignorePatterns: ['backend_tests/**'],
  };
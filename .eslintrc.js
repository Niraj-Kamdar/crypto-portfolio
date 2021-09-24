module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['prettier'],
  plugins: ['react-hooks', 'prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: ['plugin:prettier/recommended', 'prettier'],
  rules: {},
};

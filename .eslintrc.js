module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:cypress/recommended',
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'max-len': ['warn', { code: 120, tabWidth: 4 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'cypress/no-unnecessary-waiting': 'off'
  },
  plugins: ['cypress']
};

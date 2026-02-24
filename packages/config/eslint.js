/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',

    // Import
    'import/prefer-default-export': 'off',
    'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],

    // Style
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'class-methods-use-this': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
}

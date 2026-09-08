import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
        process: 'readonly',
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
  {
    files: ['seeds/**/*.js', 'tests/**/*.js'],
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
    },
  },
];

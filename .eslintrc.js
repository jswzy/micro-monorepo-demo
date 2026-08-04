/* eslint-env node */
/**
 * 全局统一 ESLint 配置
 * 所有 packages 复用本配置（root: true + 无子包 .eslintrc），不允许子包各写一套
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    // 必须放最后：关闭所有与 prettier 冲突的格式化规则
    'prettier',
  ],
  rules: {
    // ---- Vue ----
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-v-html': 'warn',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/define-macros-order': ['error', { order: ['defineProps', 'defineEmits'] }],

    // ---- TypeScript ----
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // ---- 通用 ----
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'no-debugger': 'error',
    'no-undef': 'off', // 由 TS 负责
  },
  overrides: [
    {
      files: ['*.js', '*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      // 边界约束：域内公共包不允许反向依赖任何子应用
      files: ['packages/shared-utils/**/*.{ts,vue}', 'packages/ui-package/**/*.{ts,vue}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@demo/app-*'],
                message:
                  '域内公共包禁止依赖子应用（app-*），公共包必须保持下沉、无业务方向依赖。',
              },
            ],
          },
        ],
      },
    },
  ],
  ignorePatterns: [
    'node_modules',
    'dist',
    '.turbo',
    '*.d.ts',
    'pnpm-lock.yaml',
  ],
}

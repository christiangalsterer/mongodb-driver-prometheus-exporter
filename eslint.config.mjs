import love from 'eslint-config-love'
import tseslint from 'typescript-eslint'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import jest from 'eslint-plugin-jest'

export default tseslint.config(
  love,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    name: 'base',
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    }
  },
  {
    plugins: {
      jest,
      'simple-import-sort': simpleImportSortPlugin,
      tseslint
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/init-declarations': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  },

  {
    ignores: ['dist/**/*.*', '**/*.js', '**/*.mjs']
  },
  {
    name: 'src',
    files: ['src/**/*.ts'],
    ignores: ['test/**/*.ts']
  },
  {
    name: 'test',
    files: ['test/**/*.ts'],
    ...jest.configs['flat/recommended'],
    ...jest.configs['flat/style'],
    rules: {
      // you should turn the original rule off *only* for test files
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'jest/expect-expect': 'error',
      'jest/prefer-comparison-matcher': 'error',
      'jest/prefer-called-with': 'error',
      'jest/prefer-equality-matcher': 'error',
      'jest/prefer-lowercase-title': 'error',
      'jest/require-top-level-describe': 'error',
      'jest/unbound-method': 'error'
    }
  }
)

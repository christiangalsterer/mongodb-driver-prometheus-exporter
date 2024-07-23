import love from 'eslint-config-love'
import tseslint from 'typescript-eslint'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import jest from 'eslint-plugin-jest'

export default [
  love,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
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
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },
  {
    ignores: ['dist/**/*.*', '**/*.js', '**/*.mjs']
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json']
      }
    }
  },
  {
    files: ['test/**/*.ts'],
    ...jest.configs['flat/recommended'],
    ...jest.configs['flat/style'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.test.json']
      }
    },
    rules: {
      // you should turn the original rule off *only* for test files
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
]

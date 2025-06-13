import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

export default tseslint.config(
  {
    ignores: ['dist'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module'
      }
    }
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  eslintConfigPrettier
)

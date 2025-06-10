import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import next from '@next/eslint-plugin-next'
import reactHooks from 'eslint-plugin-react-hooks'
import typescript from '@typescript-eslint/eslint-plugin'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  {
    plugins: {
      '@next/next': next,
      'react-hooks': reactHooks,
      '@typescript-eslint': typescript,
      'react-compiler': (await import('eslint-plugin-react-compiler')).default
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-compiler/react-compiler': 'error'
    }
  }
]

export default eslintConfig
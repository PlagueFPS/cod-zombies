import js from '@eslint/js'
import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
})

export default [
  ...compat.config({
    extends: ['eslint:recommended', 'next'],
    plugins: ['eslint-plugin-react-hooks', 'eslint-plugin-react']
  })
]
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // `{ omitted, ...rest }` — prop'ni DOM'ga o'tkazmaslik uchun ajratish odatiy.
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },
  {
    // shadcn/ui komponentlari bilan birga `buttonVariants` kabilar eksport
    // qilinadi; routes faylida lazy sahifalar va `routes` obyekti birga turadi.
    // Fast Refresh bu fayllarda to'liq sahifa yangilanishiga tushadi — muammo emas.
    files: [
      'src/components/ui/**/*.tsx',
      'src/app/routes/**/*.tsx',
      // `export *` barrel — qoida tekshira olmaydi.
      'src/features/dashboard/components/ui/index.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])

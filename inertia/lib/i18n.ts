import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

interface JsonModule {
  default: Record<string, any>
}

/**
 * i18next configuration for the application.
 *
 * Locale files are discovered at build time via `import.meta.glob` scanning
 * `~/locales/**\/*.json`. Each file's path is parsed to extract the language
 * code and namespace (e.g. `locales/en/admin.json` → `lng: 'en'`, `ns: 'admin'`).
 * All discovered namespaces are registered dynamically so adding a new JSON
 * file is enough to make it available — no manual registration required.
 *
 * **Interpolation** uses `{` / `}` delimiters instead of the i18next defaults
 * (`{{` / `}}`) to align with AdonisJS Edge template syntax. HTML escaping is
 * disabled because React already handles XSS protection.
 *
 * **Date formatting** is handled via the `format` callback using
 * `Intl.DateTimeFormat`. Pass a `Date` instance as the interpolation value
 * and use the format key as the `dateStyle` (`'short'`, `'medium'`, `'long'`,
 * `'full'`). Add `{ withTime: true }` to include a short time string.
 *
 * @example
 * // Translating a key
 * t('admin:users.list.title')
 *
 * // Formatting a date
 * t('common:created_at', { date: new Date(), format: 'medium' })
 *
 * // Formatting a date with time
 * i18n.format(new Date(), 'long', 'en', { withTime: true })
 */

/**
 * `import.meta.glob` scans the locales folder. We use dynamic imports to split
 * each translation file into its own chunk.
 */
const locales = import.meta.glob<JsonModule>('~/locales/**/*.json')

/**
 * Extract supported languages from the directory structure.
 * Path format: `…/locales/<lng>/<namespace>.json`
 */
export const SUPPORTED_LOCALES = Array.from(
  new Set(
    Object.keys(locales).map((path) => {
      const parts = path.split('/')
      return parts[parts.length - 2]
    })
  )
)

i18n
  .use({
    type: 'backend',
    async read(language: string, namespace: string, callback: any) {
      // Find the file path that matches the language and namespace
      const path = Object.keys(locales).find(
        (p) => p.includes(`/${language}/`) && p.includes(`/${namespace}.json`)
      )

      if (path && locales[path]) {
        try {
          const mod = await locales[path]()
          callback(null, mod.default)
        } catch (error) {
          callback(error, null)
        }
      } else {
        callback(null, null) // Fallback to other languages if not found
      }
    },
  })
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
      prefix: '{',
      suffix: '}',
      format: (value, format, lng, options) => {
        if (value instanceof Date) {
          const dateStyle = (format || 'long') as 'long' | 'full' | 'medium' | 'short'

          return new Intl.DateTimeFormat(lng, {
            dateStyle: dateStyle,
            ...(options?.withTime && { timeStyle: 'short' }),
          }).format(value)
        }
        return value
      },
    },
    react: {
      useSuspense: true, // Enabled for lazy loading
    },
  })

export default i18n

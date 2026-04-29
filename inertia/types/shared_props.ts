import { type Data } from '@generated/data'
import { type Preferences } from '#types/preferences'
import type {TranslationNodes} from "#types/translations";

export interface SharedProps {
  currentUser?: Data.User
  flash: {
    error?: string
    success?: string
    info?: string
  }
  errors: Record<string, string>
  csrfToken: string
  app_name: string
  app_url: string
  email: string
  preferences?: Preferences
  locale: string
  translations: TranslationNodes
}

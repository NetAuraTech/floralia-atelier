import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import UserTransformer from '#transformers/user_transformer'
import { inject } from '@adonisjs/core'
import PreferencesService from '#services/preferences/preference_service'
import { DEFAULT_PREFERENCES } from '#types/preferences'
import env from '#start/env'

@inject()
export default class SharePropsMiddleware {
  constructor(private preferencesService: PreferencesService) {}

  async handle(ctx: HttpContext, next: NextFn) {
    const { session, auth } = ctx as Partial<HttpContext>

    const user = auth?.user

    await user?.load((loader) => {
      loader.load('role', (role) => {
        role.preload('permissions')
      })
    })

    const errorsBag = session?.flashMessages.get('errorsBag') ?? {}
    const errorFromBag: string | undefined = Object.keys(errorsBag)
      .filter((code) => code !== 'E_VALIDATION_ERROR')
      .map((code) => errorsBag[code])[0]

    const success: string | undefined = session?.flashMessages.get('success')
    const info: string | undefined = session?.flashMessages.get('info')
    const error: string | undefined = session?.flashMessages.get('error') ?? errorFromBag

    const preferences = user ? await this.preferencesService.get(user) : DEFAULT_PREFERENCES

    ctx.sharedProps = {
      errors: session?.flashMessages.get('errors') ?? {},
      flash: {
        error,
        success,
        info,
      },
      currentUser: user ? UserTransformer.transform(user) : undefined,
      preferences,
      csrfToken: ctx.request.csrfToken,
      app_name: env.get('APP_NAME'),
      app_url: env.get('APP_URL'),
      email: env.get('MAIL_FROM_ADDRESS'),
      locale: ctx.i18n?.locale || 'en',
    }

    return next()
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    sharedProps: any
  }
}

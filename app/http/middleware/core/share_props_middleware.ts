import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import UserTransformer from '#transformers/user_transformer'
import { inject } from '@adonisjs/core'
import PreferencesService from '#services/preferences/preference_service'
import { DEFAULT_PREFERENCES } from '#types/preferences'
import env from '#start/env'

@inject()
export default class SharePropsMiddleware {
  constructor(
    private preferencesService: PreferencesService
  ) {}

  async handle(ctx: HttpContext, next: NextFn) {
    const { session, auth } = ctx as Partial<HttpContext>
    const user = auth?.user

    await user?.load((loader) => {
      loader.load('role', (role) => {
        role.preload('permissions')
      })
    })

    const all = session?.flashMessages.all() ?? {}

    const errorsBag = all.errorsBag ?? {}
    const errorFromBag: string | undefined = Object.keys(errorsBag)
      .filter((code) => code !== 'E_VALIDATION_ERROR')
      .map((code) => errorsBag[code])[0]

    const success: string | undefined = all.success
    const info: string | undefined = all.info
    const error: string | undefined = all.error ?? errorFromBag

    const preferences = user ? await this.preferencesService.get(user) : DEFAULT_PREFERENCES

    let transformedUser = undefined

    if (user) {
      const transformer = new UserTransformer(user)
      transformedUser = transformer.toObject()
    }

    ctx.sharedProps = {
      errors: session?.flashMessages.get('errors') ?? {},
      flash: {
        error,
        success,
        info,
      },
      currentUser: transformedUser,
      preferences,
      csrfToken: ctx.request.csrfToken,
      app_name: env.get('APP_NAME'),
      app_url: env.get('APP_URL'),
      email: env.get('MAIL_FROM_ADDRESS'),
      locale: ctx.i18n?.locale || 'en',
      translations: {
        pagination: {
          showing: ctx.i18n.t('pagination.showing', { start: '{start}', end: '{end}', total: '{total}'}),
          previous: ctx.i18n.t('pagination.previous'),
          next: ctx.i18n.t('pagination.next'),
        }
      }
    }

    return next()
  }
}

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    sharedProps: any
  }
}

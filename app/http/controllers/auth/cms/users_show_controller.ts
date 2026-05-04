import type { HttpContext } from '@adonisjs/core/http'
import { UserService } from '#services/auth/user_service'
import { inject } from '@adonisjs/core'
import { showValidator } from '#validators/user'
import UserTransformer from '#transformers/user_transformer'
import { enabledProviders } from '#helpers/auth/oauth'
import { PermissionService } from '#services/auth/permission_service'
import PermissionTransformer from '#transformers/permission_transformer'
import {CmsUsersShowTranslations, TranslationNodes} from "#types/translations";

@inject()
export default class UsersShowsController {
  constructor(
    protected userService: UserService,
    protected permissionService: PermissionService
  ) {}

  async render(ctx: HttpContext) {
    const { params, i18n } = ctx

    const payload = await showValidator.validate(params)

    const user = await this.userService.detail(payload.id)

    const role = user.role

    const permissions = await this.permissionService.findAll()

    return ctx.reactSSR('auth/cms/show', {
      user: await UserTransformer.transform(user).resolve(ctx.containerResolver, 0),
      providers: enabledProviders,
      permissions: await PermissionTransformer.transform(permissions).resolve(ctx.containerResolver, 0),
      translations: {
        title: i18n.t('cms.users.list.title'),
        actions: {
          edit: i18n.t('cms.users.edit.title', {username: '{username}'}),
          delete: i18n.t('cms.users.delete.title', {username: '{username}'})
        },
        info: {
          email: i18n.t('cms.users.show.info.email'),
          username: i18n.t('cms.users.show.info.username'),
          value: i18n.t('cms.users.show.info.value'),
        },
        history: {
          created_at: i18n.t('cms.users.show.history.created_at'),
          updated_at: i18n.t('cms.users.show.history.updated_at'),
          verified_at: i18n.t('cms.users.show.history.verified_at'),
          value: i18n.t('cms.users.show.history.value'),
        },
        providers: {
          connected: i18n.t('cms.users.show.providers.connected'),
          not_connected: i18n.t('cms.users.show.providers.not_connected'),
          value: i18n.t('cms.users.show.providers.value'),
        },
        roles: {
          value: i18n.t('cms.users.show.role.value'),
          current: i18n.t('cms.users.show.role.current'),
          ...[role].reduce((acc, role) => {
            acc[role.slug] = {
              value: i18n.t(`cms.users.roles.${role.slug}.value`),
              description: i18n.t(`cms.users.roles.${role.slug}.description`),
            }
            return acc
          }, {} as TranslationNodes)
        },
        permissions: {
          value: i18n.t('cms.users.show.permission.value', {amount: '{amount}'}),
          ...permissions.reduce((acc, permission) => {
            const [section, action] = permission.slug.split(".");

            if (!acc.category[section]) {
              acc.category[section] = i18n.t(`cms.users.permissions.category.${section}`);
            }

            if (!acc[section]) acc[section] = {};
            acc[section][action] = {
              value: i18n.t(`cms.users.permissions.${section}.${action}.value`),
            };

            return acc;
          }, { category: {} } as Record<string, Record<string, string | { value: string; }>>)
        },
        status: {
          verified: i18n.t('cms.users.status.verified'),
          unverified: i18n.t('cms.users.status.unverified'),
          pending_invite: i18n.t('cms.users.status.pending_invite'),
        },
      } as CmsUsersShowTranslations
    })
  }
}

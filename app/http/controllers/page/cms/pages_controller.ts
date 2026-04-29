import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PageService } from '#services/page/page_service'
import { listPageValidator, showPageValidator } from '#validators/page'
import { stripEmptyStrings } from '#helpers/core/strip_empty_strings'
import { extractPagination } from '#helpers/pagination/extract_pagination'
import PageTransformer from '#transformers/page_transformer'

@inject()
export default class PagesController {
  constructor(protected pageService: PageService) {}

  async render(ctx: HttpContext) {
    const { request } = ctx

    const pagination = await extractPagination(request)
    const data = stripEmptyStrings(request.all())
    const payload = await listPageValidator.validate(data)

    const pages = await this.pageService.list(payload, pagination)

    return ctx.reactSSR('page/cms/index', {
      pages: await PageTransformer.paginate(pages.all(), pages.getMeta()).resolve(ctx.containerResolver, 0),
      filters: payload,
    })
  }

  async destroy(ctx: HttpContext) {
    const { response, params, session, i18n } = ctx

    const payload = await showPageValidator.validate(params)

    await this.pageService.delete(payload.id)

    session.flash('success', i18n.t('page.deleted'))

    return response.redirect().toRoute('admin.pages.render')
  }

  /**
   * POST /admin/pages/:id/homepage
   * Flags this page as the global homepage.
   */
  async setHomepage(ctx: HttpContext) {
    const { params, response, auth } = ctx
    const user = auth.getUserOrFail()
    await this.pageService.setHomepage(Number(params.id), user.id)
    return response.redirect().toRoute('admin.pages_show.render', { id: params.id })
  }
}

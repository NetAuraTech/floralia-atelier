import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PageService } from '#services/page/page_service'
import { showPageValidator } from '#validators/page'
import PageTransformer from '#transformers/page_transformer'

@inject()
export default class PagesShowController {
  constructor(protected pageService: PageService) {}

  async render(ctx: HttpContext) {
    const { params } = ctx

    const { id } = await showPageValidator.validate(params)
    const page = await this.pageService.detail(id)

    return ctx.reactSSR('page/cms/show', { page: await PageTransformer.transform(page).resolve(ctx.containerResolver, 0) })
  }
}

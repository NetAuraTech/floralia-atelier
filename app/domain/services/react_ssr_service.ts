import app from '@adonisjs/core/services/app'
import vite from '@adonisjs/vite/services/main'
import type { HttpContext } from '@adonisjs/core/http'

export class ReactSSRService {
  static async render(ctx: HttpContext, component: string, pageProps: any) {
    let renderFn
    if (app.inDev) {
      const runner = await vite.createModuleRunner()
      const mod = await runner.import('/inertia/ssr.tsx')
      renderFn = mod.render
    } else {
      // In production, the SSR bundle is built to build/ssr/ssr.js
      const ssrModulePath = app.makePath('ssr/ssr.js')
      const mod = await import(ssrModulePath)
      renderFn = mod.render
    }

    const { html, helmet } = renderFn(component, pageProps, ctx.request.url(true))

    return { html, helmet }
  }
}

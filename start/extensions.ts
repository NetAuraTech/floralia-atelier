import { HttpRequest, HttpContext } from '@adonisjs/core/http'
import { ReactSSRService } from '#services/react_ssr_service'

/**
 * Check if the request expects a JSON response based on Accept header
 */
HttpRequest.macro('wantsJSON', function (this: HttpRequest) {
  const acceptsJson = this.accepts(['html', 'json']) === 'json'
  const isInertia = !!this.header('x-inertia')

  return acceptsJson && !isInertia
})

HttpContext.macro('reactSSR', async function (this: HttpContext, component: string, pageProps: any = {}) {
  const props = {
    ...this.sharedProps,
    ...pageProps,
    translations: {
      ...(this.sharedProps?.translations || {}),
      ...(pageProps?.translations || {})
    }
  }

  const { html, helmet } = await ReactSSRService.render(this, component, props)

  const pageData = JSON.stringify({ component, props })

  return this.view.render('app', {
    ssrHtml: html,
    helmetTitle: helmet?.title || '',
    helmetMeta: helmet?.meta || '',
    helmetLink: helmet?.link || '',
    pageData
  })
})

declare module '@adonisjs/core/http' {
  interface HttpRequest {
    wantsJSON(): boolean
  }
  interface HttpContext {
    reactSSR(component: string, pageProps?: any): Promise<string>
  }
}

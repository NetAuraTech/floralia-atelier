import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { PageProvider } from '~/context/page_context'
import Layout from '~/layouts/default'
import AdminLayout from '~/layouts/admin'
import i18n from '~/lib/i18n'

const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })

export function render(component: string, props: any, url: string) {
  const locale = String(props.locale || 'en')
  i18n.changeLanguage(locale)

  const helmetContext: any = {}
  
  const PageModule = pages[`./pages/${component}.tsx`] as any
  if (!PageModule) throw new Error(`Page not found: ${component}`)
  const Page = PageModule.default
  
  const LayoutType = component.includes('admin') || component.includes('cms') ? AdminLayout : Layout

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <PageProvider data={props} url={url}>
        <LayoutType>
          <Page {...props} />
        </LayoutType>
      </PageProvider>
    </HelmetProvider>
  )

  return { html, helmet: helmetContext.helmet }
}

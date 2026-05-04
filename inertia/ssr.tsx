import { renderToString } from 'react-dom/server'
import { HelmetProvider } from '@dr.pogodin/react-helmet'
import { PageProvider } from '~/context/page_context'
import Layout from '~/layouts/default'
import AdminLayout from '~/layouts/admin'

const pages = import.meta.glob('./pages/**/*.tsx', { eager: true })

export function render(component: string, props: any, url: string) {
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

  const { helmet } = helmetContext

  return {
    html,
    helmet: {
      title: helmet?.title?.toString() || '',
      meta: helmet?.meta?.toString() || '',
      link: helmet?.link?.toString() || '',
      priority: helmet?.priority?.toString() || '',
      script: helmet?.script?.toString() || '',
      style: helmet?.style?.toString() || '',
    }
  }
}

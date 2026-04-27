import './css/app.css'
import { hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { PageProvider } from '~/context/page_context'
import Layout from '~/layouts/default'
import AdminLayout from '~/layouts/admin'
import i18n from '~/lib/i18n'

declare global {
  interface Window {
    __PAGE__: {
      component: string
      props: any
    }
  }
}

const { component, props } = window.__PAGE__

const pages = import.meta.glob('./pages/**/*.tsx')

async function bootstrap() {
  const locale = String(props.locale || 'en')
  await i18n.changeLanguage(locale)

  const module = (await pages[`./pages/${component}.tsx`]()) as any
  const Page = module.default

  const LayoutType = component.includes('admin') || component.includes('cms') ? AdminLayout : Layout

  const app = document.getElementById('app')
  if (!app) throw new Error('Root element #app not found')

  hydrateRoot(
    app,
    <HelmetProvider>
      <PageProvider data={props} url={window.location.pathname}>
        <LayoutType>
          <Page {...props} />
        </LayoutType>
      </PageProvider>
    </HelmetProvider>
  )
}

bootstrap()

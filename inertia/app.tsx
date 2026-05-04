import './css/app.css'
import { hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from '@dr.pogodin/react-helmet'
import { PageProvider } from '~/context/page_context'
import { lazy, Suspense } from 'react'

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
  const module = (await pages[`./pages/${component}.tsx`]()) as any
  const Page = module.default

  const LayoutModule = component.includes('admin') || component.includes('cms')
    ? await import('~/layouts/admin')
    : await import('~/layouts/default')
  const LayoutType = LayoutModule.default

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

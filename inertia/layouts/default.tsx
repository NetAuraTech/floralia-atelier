import {ReactElement, useEffect} from 'react'
import { Header } from '~/components/organisms/header'
import { Footer } from '~/components/organisms/footer'
import { toast, Toaster } from 'sonner'
import { Helmet } from 'react-helmet-async'
import { usePageContext } from '~/context/page_context'
import type { SharedProps } from '~/types/shared_props'

interface LayoutProps {
  children: ReactElement<SharedProps>
}

/**
 * Root layout for all public-facing pages.
 *
 * Wraps page content in the `#page-wrapper` flex-column container with a
 * persistent `<Header>` at the top and a `<Footer>` pinned to the bottom via
 * `mt-auto`. A `<Toaster>` is mounted at top-right to surface flash messages
 * passed via Inertia shared props (`flash.error`, `flash.success`, `flash.info`).
 *
 * **Flash messages** are displayed as `sonner` toast notifications and
 * automatically dismissed on every Inertia navigation so stale messages never
 * carry over to the next page.
 *
 * @example
 * // Attached to a public page component
 * LoginPage.layout = (page) => <Layout>{page}</Layout>
 *
 * // Or used as the default layout in the Inertia setup
 * createInertiaApp({
 *   resolve: (name) => {
 *     const page = pages[name]
 *     page.layout ??= (page) => <Layout>{page}</Layout>
 *     return page
 *   }
 * })
 */
export default function Layout(props: LayoutProps) {
  const { children } = props
  const { props: pageProps, url } = usePageContext<SharedProps>()
  const { app_name, app_url, flash } = pageProps

  useEffect(() => {
    toast.dismiss()
  }, [url])

  if (flash?.error) toast.error(flash.error)
  if (flash?.success) toast.success(flash.success)
  if (flash?.info) toast.info(flash.info)

  return (
    <>
      <Helmet>
        <link rel="canonical" href={app_url} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="language" content="fr" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Floralia Atelier" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:url" content={app_url} />
        <meta property="og:site_name" content={app_name} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:image:alt" content={`${app_name} - Fleuriste artisan, compositions florales et entretien de sépultures`} />
        <meta name="geo.region" content="FR-62" />
        <meta name="geo.placename" content="Samer" />
        <meta name="author" content={app_name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={app_name} />
        <meta name="twitter:image:alt" content={`${app_name} - Fleuriste artisan, compositions florales et entretien de sépultures`} />
        <meta name="twitter:description" content="Entretien et fleurissement de sépultures avec délicatesse. Créations florales sur mesure pour mariages, baptêmes et événements. Devis gratuit." />
      </Helmet>
      <>
        <Header/>
        <Toaster position="top-right" richColors/>
        {children}
        <Footer/>
      </>
    </>
  )
}

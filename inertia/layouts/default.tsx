import {ReactElement, useEffect} from 'react'
import { Header } from '~/components/organisms/header'
import { Footer } from '~/components/organisms/footer'
import { toast, Toaster } from 'sonner'
import { Helmet } from '@dr.pogodin/react-helmet'
import { usePageContext } from '~/context/page_context'
import type { SharedProps } from '~/types/shared_props'

interface LayoutProps {
  children: ReactElement<SharedProps>
}

/**
 * Root layout for all public-facing pages.
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
        <link rel="canonical" href={`${app_url}${url}`} />
        <link rel="preconnect" href="https://api.iconify.design" />
        <link rel="dns-prefetch" href="https://api.iconify.design" />

        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="language" content="fr" />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Floralia Atelier" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:url" content={`${app_url}${url}`} />
        <meta property="og:site_name" content={app_name} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:image:alt" content={`${app_name} - Fleuriste artisan, compositions florales et entretien de sépultures`} />
        <meta name="geo.region" content="FR-62" />
        <meta name="geo.placename" content="Samer" />
        <meta name="author" content={app_name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={app_name} />
        <meta name="twitter:image:alt" content={`${app_name} - Fleuriste artisan, compositions florales et entretien de sépultures`} />
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

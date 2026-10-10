import { SharedProps } from '@adonisjs/inertia/types';
import { Footer } from '@foundry/design-system/footer';
import { Header } from '@foundry/design-system/header';
import { navLink } from '@foundry/design-system/nav-link';
import { Paragraph } from '@foundry/design-system/paragraph';
import { SiteIntro } from '@foundry/design-system/site-intro';
import { Head, router, usePage } from '@inertiajs/react';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { urlFor } from '~/client';

interface LayoutProps {
	children: ReactElement<SharedProps>;
}

/**
 * Root layout for all public-facing pages.
 *
 * Owns the floralia identity around every rendered page: the one-page
 * navigation header (anchor links into the homepage sections), the footer
 * with the CMS page links and credits, the per-page SEO head, and the
 * animated site intro on the first load.
 */
export default function Layout(props: LayoutProps) {
	const { children } = props;
	const { props: pageProps, url, flash, component } = usePage<SharedProps>();
	const { app_name, app_url } = pageProps;

	// Error pages (`errors/*`) are wrapped by this layout too, so the layout
	// owns their robots meta: noindex there, indexable everywhere else.
	const robotsContent = component?.startsWith('errors/')
		? 'noindex, nofollow'
		: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

	const homeHref = urlFor('core.home.render');

	// The brand wordmark: the name with its italic accent word.
	const brand = (
		<>
			Floralia <span className="text-secondary italic">Atelier</span>
		</>
	);

	const pageHref = (slug: string) => urlFor('cms.page.render', { slug });

	// One-page site: the navigation anchors the homepage sections (the logo
	// links to the homepage itself).
	const headerLinks = [
		{ label: 'Services', href: `${homeHref}#services` },
		{ label: 'Histoire', href: `${homeHref}#about` },
		{ label: 'Créations', href: `${homeHref}#creations` },
		{ label: 'Contact', href: `${homeHref}#contact` },
	];

	const footerDescription = (
		<Paragraph variant="ink-inverted" className="text-sm font-light leading-relaxed max-w-md flex items-center gap-2">
			Art floral & entretien de sépultures. Nous prenons soin des lieux de mémoire avec respect et délicatesse.
		</Paragraph>
	);

	const footerSections = [
		{
			title: 'Services',
			links: [
				{ label: 'Nettoyage de sépultures', href: pageHref('nettoyage-sepultures') },
				{ label: 'Fleurissement de sépultures', href: pageHref('fleurissement-sepultures') },
				{ label: 'Bouquets & compositions sur mesure', href: pageHref('bouquets-compositions-sur-mesure') },
				{ label: "Décoration florales d'événements", href: pageHref('decoration-florale-evenements') },
			],
		},
		{
			title: 'Infos',
			links: [
				{ label: 'Notre histoire', href: `${homeHref}#about` },
				{ label: 'Mentions légales', href: pageHref('mentions-legales') },
				{ label: 'Politique de confidentialité', href: pageHref('politique-de-confidentialite') },
			],
		},
	];

	const footerCopyright = (
		<Paragraph variant="ink-inverted" className="text-sm font-light leading-relaxed max-w-md flex items-center gap-2">
			{`© 2026 ${app_name} — Tous droits réservés`}
		</Paragraph>
	);

	const footerCredit = (
		<Paragraph variant="ink-inverted" className="text-sm font-light leading-relaxed max-w-md flex items-center gap-2">
			Fait avec ♥ par{' '}
			<a href="https://www.netauratech.fr" className={navLink({ variant: 'external' })}>
				NetAuraTech
			</a>
		</Paragraph>
	);

	// The header's mobile menu is a controlled presentational component — the
	// layout owns its open/close state, including the close-on-navigation
	// behaviour (the package never subscribes to the Inertia router itself).
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const closeMenu = useCallback(() => {
		setIsMenuOpen(false);

		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
	}, []);

	useEffect(() => {
		const unregisterListener = router.on('success', closeMenu);

		return () => unregisterListener();
	}, [closeMenu]);

	// The animated site intro plays once, on the initial page load. The layout
	// persists across Inertia visits, so the intro's state never restarts on
	// navigation: the site starts hidden behind the intro and is revealed when
	// the intro begins its exit (the intro unmounts itself once its clip
	// animation has run).
	const siteRef = useRef<HTMLDivElement | null>(null);

	const revealSite = useCallback(() => {
		siteRef.current?.classList.add('visible');
	}, []);

	useEffect(() => {
		toast.dismiss();

		if (flash.error) toast.error(flash.error);
		if (flash.success) toast.success(flash.success);
		if (flash.info) toast.info(flash.info);
	}, [url, flash]);

	const imageAlt = 'Fleuriste artisan, compositions florales et entretien de sépultures';

	return (
		<>
			<Head>
				<noscript>
					<style>{'#site{opacity:1}'}</style>
				</noscript>
				<link rel="canonical" href={`${app_url}${url}`} />
				<link rel="preconnect" href="https://api.iconify.design" />
				<link rel="dns-prefetch" href="https://api.iconify.design" />
				<meta name="robots" content={robotsContent} />
				<meta name="language" content="fr" />
				<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="shortcut icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<meta name="apple-mobile-web-app-title" content={app_name} />
				<link rel="manifest" href="/site.webmanifest" />
				<meta property="og:url" content={`${app_url}${url}`} />
				<meta property="og:site_name" content={app_name} />
				<meta property="og:type" content="website" />
				<meta property="og:locale" content="fr_FR" />
				<meta property="og:image:alt" content={`${app_name} - ${imageAlt}`} />
				<meta name="geo.region" content="FR-62" />
				<meta name="geo.placename" content="Samer" />
				<meta name="author" content={app_name} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={app_name} />
				<meta name="twitter:image:alt" content={`${app_name} - ${imageAlt}`} />
			</Head>
			<SiteIntro title={brand} tagline="Art floral · Entretien de sépultures" onExit={revealSite} />
			<div id="site" ref={siteRef}>
				<Header
					appName={brand}
					homeHref={homeHref}
					links={headerLinks}
					isMenuOpen={isMenuOpen}
					onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
					onMenuClose={closeMenu}
				/>
				<Toaster position="top-right" richColors />
				{children}
				<Footer
					appName={brand}
					homeHref={homeHref}
					description={footerDescription}
					sections={footerSections}
					copyright={footerCopyright}
					credit={footerCredit}
				/>
			</div>
		</>
	);
}

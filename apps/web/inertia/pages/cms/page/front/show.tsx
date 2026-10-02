import { SharedProps } from '@adonisjs/inertia/types';
import { Head, usePage } from '@inertiajs/react';
import PageRenderer from '~/components/cms/renderer/page_renderer';
import type { ResolvedPageContent } from '#cms/types/page';

type PageProps = {
	id: number;
	locale: string;
	title: string;
	metaTitle: string | null;
	metaDescription: string | null;
	metaImage: string | null;
	content: ResolvedPageContent;
};

/**
 * Public-facing Inertia page for rendered pages.
 *
 * Handles SEO via Inertia's `<Head>` component (title, description, Open
 * Graph / Twitter tags and the florist's `LocalBusiness` JSON-LD) and
 * delegates the actual block rendering to `PageRenderer`.
 */
export default function PageShowPage(props: PageProps) {
	const { id, locale, title, metaTitle, metaDescription, metaImage, content } = props;
	const { email, app_url } = usePage<SharedProps>().props;
	const seoTitle = metaTitle ?? title;

	const seoOgImage = metaImage ?? `${app_url}/og-image.jpg`;

	return (
		<>
			<Head title={seoTitle}>
				{metaDescription && <meta name="description" content={metaDescription} />}
				<meta property="og:title" content={seoTitle} />
				{metaDescription && <meta property="og:description" content={metaDescription} />}
				{metaDescription && <meta name="twitter:description" content={metaDescription} />}
				<meta property="og:image" content={seoOgImage} />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<meta property="og:type" content="website" />
				<meta name="twitter:image" content={seoOgImage} />
				<script type="application/ld+json">
					{JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'LocalBusiness',
						'@id': `${app_url}/#business`,
						name: 'Floralia Atelier',
						url: `${app_url}`,
						logo: `${app_url}/logo.png`,
						image: seoOgImage,
						description:
							"Artisan fleuriste spécialisé dans l'entretien et le fleurissement de sépultures, ainsi que les créations florales sur mesure pour mariages, baptêmes et événements.",
						telephone: '+336-58-02-95-39',
						email,
						address: {
							'@type': 'PostalAddress',
							addressLocality: 'Samer',
							postalCode: '62830',
							addressCountry: 'FR',
						},
						openingHoursSpecification: [
							{
								'@type': 'OpeningHoursSpecification',
								dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
								opens: '09:00',
								closes: '18:00',
							},
						],
						priceRange: '€€',
						hasOfferCatalog: {
							'@type': 'OfferCatalog',
							name: 'Services floraux',
							itemListElement: [
								{
									'@type': 'Offer',
									itemOffered: {
										'@type': 'Service',
										name: 'Entretien de sépultures',
										description: 'Fleurissement et entretien régulier des tombes et monuments funéraires',
									},
								},
								{
									'@type': 'Offer',
									itemOffered: {
										'@type': 'Service',
										name: 'Créations florales pour mariages',
										description: 'Bouquets, compositions et décoration florale sur mesure pour mariages',
									},
								},
								{
									'@type': 'Offer',
									itemOffered: {
										'@type': 'Service',
										name: 'Créations florales pour baptêmes et événements',
									},
								},
							],
						},
					})}
				</script>
			</Head>
			<PageRenderer content={content} pageId={id} locale={locale} />
		</>
	);
}

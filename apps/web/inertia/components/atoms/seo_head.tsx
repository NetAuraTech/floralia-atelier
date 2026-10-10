import { Head } from '@inertiajs/react';
import type { JsonLd } from '~/helpers/structured_data';

interface SeoHeadProps {
	/** The page title (transformed by the app's `title` option). */
	title: string;
	/** Meta description; omitted when absent. */
	description?: string | null;
	/** Absolute og:image URL; omitted when absent. */
	image?: string | null;
	/** og:image width in pixels; omitted when absent. */
	imageWidth?: number | null;
	/** og:image height in pixels; omitted when absent. */
	imageHeight?: number | null;
	/** JSON-LD nodes to emit as `application/ld+json` scripts. */
	jsonLd?: JsonLd[];
	/**
	 * Emit a `noindex, nofollow` robots meta. For pages that bypass the app
	 * layout (which otherwise owns the site-wide robots meta), e.g. the
	 * maintenance screen.
	 */
	noIndex?: boolean;
}

/**
 * The shared per-page SEO head of the public front.
 *
 * Owns the page-level tags — title, description, the Open Graph / Twitter
 * cards, and any JSON-LD — leaving the site-wide chrome (canonical,
 * `og:url`, `og:site_name`, locale, favicons, robots) to the app layout. Every
 * public page composes its head through this single atom so the contract never
 * drifts between pages.
 *
 * @example
 * <SeoHead title={seoTitle} description={metaDescription} image={ogImage} jsonLd={[localBusiness]} />
 */
export default function SeoHead({ title, description, image, imageWidth, imageHeight, jsonLd, noIndex }: SeoHeadProps) {
	return (
		<Head title={title}>
			{noIndex && <meta name="robots" content="noindex, nofollow" />}
			{description && <meta name="description" content={description} />}
			<meta property="og:title" content={title} />
			{description && <meta property="og:description" content={description} />}
			{description && <meta name="twitter:description" content={description} />}
			{image && <meta property="og:image" content={image} />}
			{imageWidth != null && <meta property="og:image:width" content={String(imageWidth)} />}
			{imageHeight != null && <meta property="og:image:height" content={String(imageHeight)} />}
			{image && <meta name="twitter:image" content={image} />}
			{jsonLd?.map((node, index) => (
				<script key={index} type="application/ld+json">
					{JSON.stringify(node)}
				</script>
			))}
		</Head>
	);
}

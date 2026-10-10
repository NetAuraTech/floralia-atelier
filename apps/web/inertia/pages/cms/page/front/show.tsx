import { SharedProps } from '@adonisjs/inertia/types';
import { usePage } from '@inertiajs/react';
import SeoHead from '~/components/atoms/seo_head';
import PageRenderer from '~/components/cms/renderer/page_renderer';
import { buildLocalBusiness } from '~/helpers/structured_data';
import type { ResolvedPageContent } from '#cms/types/page';

type PageProps = {
	id: number;
	locale: string;
	title: string;
	metaTitle: string | null;
	metaDescription: string | null;
	metaImage: string | null;
	metaImageWidth?: number | null;
	metaImageHeight?: number | null;
	content: ResolvedPageContent;
};

/**
 * Public-facing Inertia page for rendered pages.
 *
 * Handles SEO through the shared {@link SeoHead} atom — the per-page title and
 * description, the Open Graph / Twitter cards with the image's real dimensions,
 * and the florist's `LocalBusiness` JSON-LD (built by the pure
 * `buildLocalBusiness` helper) — and delegates the actual block rendering to
 * `PageRenderer`.
 */
export default function PageShowPage(props: PageProps) {
	const { id, locale, title, metaTitle, metaDescription, metaImage, metaImageWidth, metaImageHeight, content } = props;
	const { email, app_url, app_name } = usePage<SharedProps>().props;
	const seoTitle = metaTitle ?? title;

	// The page's og image: a per-page image when set, otherwise the static
	// site-wide default (known to be 1200×630).
	const seoOgImage = metaImage ?? `${app_url}/og-image.jpg`;
	const imageWidth = metaImage ? metaImageWidth : 1200;
	const imageHeight = metaImage ? metaImageHeight : 630;

	const localBusiness = buildLocalBusiness({
		appUrl: app_url ?? '',
		appName: app_name ?? '',
		email,
		image: seoOgImage,
	});

	return (
		<>
			<SeoHead
				title={seoTitle}
				description={metaDescription}
				image={seoOgImage}
				imageWidth={imageWidth}
				imageHeight={imageHeight}
				jsonLd={[localBusiness]}
			/>
			<PageRenderer content={content} pageId={id} locale={locale} />
		</>
	);
}

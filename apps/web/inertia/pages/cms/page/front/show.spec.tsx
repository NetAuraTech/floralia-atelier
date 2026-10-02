import { TuyauProvider } from '@adonisjs/inertia/react';
// @vitest-environment jsdom
// @vitest-environment-options { "url": "http://localhost/" }
import { act, isValidElement, type ReactElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { client } from '~/client';
import ShowPage from '~/pages/cms/page/front/show';
import type { ResolvedPageContent } from '#cms/types/page';

/**
 * Public page SEO contract: the `LocalBusiness` JSON-LD carries the florist's
 * identity (name, phone, Samer address, opening hours, price range, offer
 * catalog) and the per-page meta falls back from the page title to the
 * default og image when the page sets none.
 *
 * The real page runs end to end; only Inertia's server-provided `usePage`
 * context is substituted and `Head` renders its children inline so the meta
 * and JSON-LD assertions read the real DOM.
 */

const { mockPageProps, capturedHead } = vi.hoisted(() => ({
	mockPageProps: {
		props: {
			email: 'contact@floralia-atelier.fr',
			app_url: 'http://localhost:3333',
			app_name: 'Floralia Atelier',
		},
	},
	capturedHead: { title: undefined as string | undefined, children: undefined as ReactNode },
}));

vi.mock('@inertiajs/react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@inertiajs/react')>();
	return {
		...actual,
		usePage: () => mockPageProps,
		Head: ({ title, children }: { title?: string; children?: ReactNode }) => {
			capturedHead.title = title;
			capturedHead.children = children;
			return <>{children}</>;
		},
	};
});

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
	capturedHead.title = undefined;
	capturedHead.children = undefined;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(async () => {
	await act(async () => root.unmount());
	container.remove();
});

const content: ResolvedPageContent = { blocks: [] };

function render(props: {
	title: string;
	metaTitle: string | null;
	metaDescription: string | null;
	metaImage: string | null;
}) {
	return act(async () => {
		root.render(
			<TuyauProvider client={client}>
				<ShowPage id={1} locale="fr" content={content} {...props} />
			</TuyauProvider>,
		);
	});
}

function jsonLd() {
	const script = container.querySelector('script[type="application/ld+json"]');
	expect(script).not.toBeNull();
	return JSON.parse(script!.textContent!);
}

/**
 * React 19 hoists `<meta>` tags out of the jsdom render tree, so the meta
 * assertions read the elements captured by the `Head` mock rather than the
 * DOM. Walks the captured children and returns the `content` of the first
 * meta element whose `name`/`property` matches, or `undefined` when absent.
 */
function collectMetas(node: ReactNode, out: ReactElement[] = []): ReactElement[] {
	if (isValidElement(node)) {
		if (node.type === 'meta') out.push(node);
		collectMetas((node.props as { children?: ReactNode }).children, out);
	} else if (Array.isArray(node)) {
		for (const child of node) collectMetas(child, out);
	}

	return out;
}

function headMetaContent(attr: 'name' | 'property', value: string): string | undefined {
	const meta = collectMetas(capturedHead.children).find((m) => (m.props as Record<string, unknown>)[attr] === value);

	return meta ? ((meta.props as Record<string, unknown>).content as string | undefined) : undefined;
}

describe('ShowPage — SEO', () => {
	it('emits the florist LocalBusiness JSON-LD', async () => {
		await render({ title: 'Accueil', metaTitle: null, metaDescription: null, metaImage: null });

		const ld = jsonLd();

		expect(ld['@type']).toBe('LocalBusiness');
		expect(ld.name).toBe('Floralia Atelier');
		expect(ld['@id']).toBe('http://localhost:3333/#business');
		expect(ld.url).toBe('http://localhost:3333');
		expect(ld.logo).toBe('http://localhost:3333/logo.png');
		expect(ld.image).toBe('http://localhost:3333/og-image.jpg');
		expect(ld.telephone).toBe('+336-58-02-95-39');
		expect(ld.email).toBe('contact@floralia-atelier.fr');
		expect(ld.address).toMatchObject({
			'@type': 'PostalAddress',
			addressLocality: 'Samer',
			postalCode: '62830',
			addressCountry: 'FR',
		});
		expect(ld.openingHoursSpecification[0]).toMatchObject({
			opens: '09:00',
			closes: '18:00',
			dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		});
		expect(ld.priceRange).toBe('€€');
		expect(ld.hasOfferCatalog.name).toBe('Services floraux');
		expect(ld.hasOfferCatalog.itemListElement).toHaveLength(3);
	});

	it('uses the page meta title and description when set, and the fallbacks otherwise', async () => {
		await render({ title: 'Accueil', metaTitle: null, metaDescription: null, metaImage: null });

		expect(capturedHead.title).toBe('Accueil');
		expect(headMetaContent('name', 'description')).toBeUndefined();
		expect(headMetaContent('property', 'og:image')).toBe('http://localhost:3333/og-image.jpg');

		await act(async () => {
			root.render(
				<TuyauProvider client={client}>
					<ShowPage
						id={2}
						locale="fr"
						content={content}
						title="Nettoyage de sépultures"
						metaTitle="Entretien de sépultures à Samer"
						metaDescription="Nous nettoyons et fleurissons votre sépulture."
						metaImage="https://files.example.com/meta.jpg"
					/>
				</TuyauProvider>,
			);
		});

		expect(capturedHead.title).toBe('Entretien de sépultures à Samer');
		expect(headMetaContent('name', 'description')).toBe('Nous nettoyons et fleurissons votre sépulture.');
		expect(headMetaContent('property', 'og:image')).toBe('https://files.example.com/meta.jpg');
	});
});

import { TuyauProvider } from '@adonisjs/inertia/react';
// @vitest-environment jsdom
// @vitest-environment-options { "url": "http://localhost/" }
import { act, isValidElement, type ReactElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { client } from '~/client';
import ShowPage from '~/pages/cms/page/front/show';
import type { ResolvedPageContent } from '#cms/types/page';
import type { LegalIdentity } from '#types/seo';

/**
 * Public page SEO contract: the `LocalBusiness` JSON-LD carries the publisher
 * identity resolved from the `LEGAL_*` env, the `BreadcrumbList` carries the
 * page trail, and the per-page meta falls back to the default og image when
 * the page sets none.
 *
 * The real page runs end to end; only Inertia's server-provided `usePage`
 * context is substituted and `Head` renders its children inline so the meta
 * and JSON-LD assertions read the real DOM.
 */

const legalIdentity: LegalIdentity = {
	name: 'Floralia Atelier',
	siret: '12345678901234',
	address: '62830, Samer, France',
	phone: '+33 6 58 02 95 39',
};

const { mockPageProps, capturedHead } = vi.hoisted(() => ({
	mockPageProps: {
		props: {
			email: 'contact@floralia-atelier.fr',
			app_url: 'http://localhost:3333',
			app_name: 'Floralia Atelier',
			legal_identity: {} as LegalIdentity,
		},
	},
	capturedHead: { children: undefined as ReactNode },
}));

vi.mock('@inertiajs/react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@inertiajs/react')>();
	return {
		...actual,
		usePage: () => mockPageProps,
		Head: ({ children }: { children?: ReactNode }) => {
			capturedHead.children = children;
			return <>{children}</>;
		},
	};
});

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
	mockPageProps.props.legal_identity = legalIdentity;
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

function jsonLdScripts() {
	return [...container.querySelectorAll('script[type="application/ld+json"]')].map((script) =>
		JSON.parse(script.textContent!),
	);
}

/**
 * React 19 hoists `<meta>` tags out of the jsdom render tree, so the meta
 * assertions read the elements captured by the `Head` mock rather than the
 * DOM. Walks the captured children and returns the elements of a given type.
 */
function collect(node: ReactNode, type: string, out: ReactElement[] = []): ReactElement[] {
	if (isValidElement(node)) {
		if (node.type === type) out.push(node);
		collect((node.props as { children?: ReactNode }).children, type, out);
	} else if (Array.isArray(node)) {
		for (const child of node) collect(child, type, out);
	}

	return out;
}

function headMetaContent(attr: 'name' | 'property', value: string): string | undefined {
	const meta = collect(capturedHead.children, 'meta').find((m) => (m.props as Record<string, unknown>)[attr] === value);

	return meta ? ((meta.props as Record<string, unknown>).content as string | undefined) : undefined;
}

function headTitle(): string | undefined {
	const title = collect(capturedHead.children, 'title')[0];

	return title ? ((title.props as { children?: string }).children ?? undefined) : undefined;
}

describe('ShowPage — SEO', () => {
	it('emits the publisher LocalBusiness JSON-LD', async () => {
		await render({ title: 'Accueil', metaTitle: null, metaDescription: null, metaImage: null });

		const [ld] = jsonLdScripts();

		expect(ld['@type']).toBe('LocalBusiness');
		expect(ld.name).toBe('Floralia Atelier');
		expect(ld['@id']).toBe('http://localhost:3333/#business');
		expect(ld.url).toBe('http://localhost:3333');
		expect(ld.legalName).toBe('Floralia Atelier');
		expect(ld.image).toBe('http://localhost:3333/og-image.jpg');
		expect(ld.telephone).toBe('+33 6 58 02 95 39');
		expect(ld.taxID).toBe('12345678901234');
		expect(ld.email).toBe('contact@floralia-atelier.fr');
		expect(ld.address).toEqual({
			'@type': 'PostalAddress',
			postalCode: '62830',
			addressLocality: 'Samer',
			addressCountry: 'FR',
		});
	});

	it('emits the breadcrumb trail', async () => {
		await render({ title: 'Accueil', metaTitle: null, metaDescription: null, metaImage: null });

		const [, breadcrumb] = jsonLdScripts();

		expect(breadcrumb['@type']).toBe('BreadcrumbList');
		expect(breadcrumb.itemListElement).toEqual([
			{ '@type': 'ListItem', position: 1, name: 'Floralia Atelier', item: 'http://localhost:3333/' },
			{ '@type': 'ListItem', position: 2, name: 'Accueil' },
		]);
	});

	it('uses the page meta title and description when set, and the fallbacks otherwise', async () => {
		await render({ title: 'Accueil', metaTitle: null, metaDescription: null, metaImage: null });

		expect(headTitle()).toBe('Accueil');
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

		expect(headTitle()).toBe('Entretien de sépultures à Samer');
		expect(headMetaContent('name', 'description')).toBe('Nous nettoyons et fleurissons votre sépulture.');
		expect(headMetaContent('property', 'og:image')).toBe('https://files.example.com/meta.jpg');
	});
});

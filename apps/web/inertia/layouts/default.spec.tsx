import { TuyauProvider } from '@adonisjs/inertia/react';
// @vitest-environment jsdom
// @vitest-environment-options { "url": "http://localhost/" }
import { http, router, type HttpRequestConfig, type Page } from '@inertiajs/core';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { client } from '~/client';
import Layout from '~/layouts/default';
import type { SharedProps } from '@adonisjs/inertia/types';
import type { ReactElement } from 'react';

/**
 * Public layout contract: the floralia identity around every rendered page —
 * the one-page header navigation (anchor links into the homepage sections),
 * the footer's CMS page links, and the first-load site intro that hides the
 * site behind it, reveals it on its exit, and unmounts itself afterwards.
 *
 * The real layout, real design-system components and real Tuyau registry run
 * end to end. Only Inertia's server-provided `usePage` context is substituted
 * (the real one only exists inside an Inertia-managed app).
 */

const { mockPage } = vi.hoisted(() => ({
	mockPage: {
		url: 'http://localhost/',
		props: {
			email: 'contact@floralia-atelier.fr',
			app_url: 'http://localhost:3333',
			app_name: 'Floralia Atelier',
		},
		flash: { error: undefined, success: undefined, info: undefined },
	},
}));

vi.mock('@inertiajs/react', async (importOriginal) => {
	const actual = await importOriginal<typeof import('@inertiajs/react')>();
	return {
		...actual,
		usePage: () => mockPage,
		Head: () => null,
	};
});

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const PAGE: Page = {
	url: 'http://localhost/',
	component: 'Layout',
	props: { errors: {} },
	version: null,
	rescuedProps: [],
	flash: { error: undefined, success: undefined, info: undefined },
	rememberedState: {},
};

beforeAll(() => {
	// Bring the real core router to life in jsdom (the layout subscribes to
	// its `success` event), and give the SVG logo path the geometry API jsdom
	// lacks (the intro measures it on mount).
	router.init({
		initialPage: { ...PAGE },
		resolveComponent: async () => null,
		swapComponent: () => Promise.resolve(),
		onFlash: () => {},
	});
	http.setClient({
		request: async (_config: HttpRequestConfig) => ({
			status: 200,
			data: JSON.stringify(PAGE),
			headers: { 'x-inertia': 'true' },
		}),
	});
	(SVGElement.prototype as unknown as { getTotalLength: () => number }).getTotalLength = () => 100;
});

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
	vi.useFakeTimers();
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(async () => {
	await act(async () => root.unmount());
	container.remove();
	vi.useRealTimers();
});

function renderLayout() {
	const child = (<div>home content</div>) as ReactElement<SharedProps>;

	return act(async () => {
		root.render(
			<TuyauProvider client={client}>
				<Layout>{child}</Layout>
			</TuyauProvider>,
		);
	});
}

describe('Layout — public identity', () => {
	it('renders the one-page header navigation with the homepage anchor links', async () => {
		await renderLayout();

		const links = Array.from(container.querySelectorAll('#primary-navigation a'));

		expect(links.map((a) => a.textContent)).toEqual(['Services', 'Histoire', 'Créations', 'Contact']);
		expect(links.map((a) => a.getAttribute('href'))).toEqual(['/#services', '/#about', '/#creations', '/#contact']);
	});

	it('renders the footer with the six CMS page links and the credits', async () => {
		await renderLayout();

		const footerLinks = Array.from(container.querySelectorAll('footer a')).map((a) => a.getAttribute('href'));

		// The six CMS pages plus the "notre histoire" anchor (the logo is an
		// Inertia Link to home and the NetAuraTech credit is a plain anchor).
		expect(footerLinks).toContain('/nettoyage-sepultures');
		expect(footerLinks).toContain('/fleurissement-sepultures');
		expect(footerLinks).toContain('/bouquets-compositions-sur-mesure');
		expect(footerLinks).toContain('/decoration-florale-evenements');
		expect(footerLinks).toContain('/mentions-legales');
		expect(footerLinks).toContain('/politique-de-confidentialite');
		expect(footerLinks).toContain('/#about');
		expect(footerLinks).toContain('https://www.netauratech.fr');
	});

	it('hides the site behind the intro, reveals it on the intro exit, then unmounts the intro', async () => {
		await renderLayout();

		const site = container.querySelector('#site');
		const intro = container.querySelector('#intro');

		expect(site).not.toBeNull();
		expect(intro).not.toBeNull();
		expect(site!.classList.contains('visible')).toBe(false);

		// The intro plays for 3600 ms, then starts its exit.
		await act(async () => {
			vi.advanceTimersByTime(3600);
		});
		expect(site!.classList.contains('visible')).toBe(true);
		expect(container.querySelector('#intro')?.classList.contains('exit')).toBe(true);

		// Once the 1100 ms clip animation is done, the intro is gone.
		await act(async () => {
			vi.advanceTimersByTime(1100);
		});
		expect(container.querySelector('#intro')).toBeNull();
	});
});

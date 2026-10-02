import { TuyauProvider } from '@adonisjs/inertia/react';
// @vitest-environment jsdom
// @vitest-environment-options { "url": "http://localhost/" }
import { http, router, type HttpRequestConfig, type Page } from '@inertiajs/core';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { client } from '~/client';
import NotFound from '~/pages/errors/not_found';
import ServerError from '~/pages/errors/server_error';

/**
 * Error page contract: 404 and 500 render the floralia identity (French copy,
 * the big numeral, a heading) and offer a link back to the homepage.
 *
 * The real pages and real Tuyau registry run end to end; only the Inertia
 * core router is seeded so the `Link`s resolve.
 */

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

const PAGE: Page = {
	url: 'http://localhost/',
	component: 'NotFound',
	props: { errors: {} },
	version: null,
	rescuedProps: [],
	flash: { error: undefined, success: undefined, info: undefined },
	rememberedState: {},
};

beforeAll(() => {
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
});

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(async () => {
	await act(async () => root.unmount());
	container.remove();
});

function renderPage(element: React.ReactElement) {
	return act(async () => {
		root.render(<TuyauProvider client={client}>{element}</TuyauProvider>);
	});
}

describe('Error pages', () => {
	it('renders the floralia 404 with a link back home', async () => {
		await renderPage(<NotFound />);

		expect(container.textContent).toContain('404');
		expect(container.textContent).toContain('Page introuvable');
		expect(container.querySelector('a')?.getAttribute('href')).toBe('/');
	});

	it('renders the floralia 500 with a link back home', async () => {
		await renderPage(<ServerError />);

		expect(container.textContent).toContain('500');
		expect(container.textContent).toContain('Erreur serveur');
		expect(container.querySelector('a')?.getAttribute('href')).toBe('/');
	});
});

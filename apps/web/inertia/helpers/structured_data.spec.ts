import { describe, it, expect } from 'vitest';
import {
	buildLocalBusiness,
	buildOfferCatalog,
	isPlaceholder,
	FLORIST_IDENTITY,
	FLORIST_SERVICES,
} from '~/helpers/structured_data';

/**
 * Structured-data contract: the `LocalBusiness` builder composes the florist's
 * identity and service catalogue into a `schema.org` node, omitting any field
 * that is still an unset placeholder and dropping the `hasOfferCatalog` when the
 * catalogue is empty.
 */

describe('isPlaceholder', () => {
	it('flags undefined, blank, and the sentinel value', () => {
		expect(isPlaceholder(undefined)).toBe(true);
		expect(isPlaceholder('')).toBe(true);
		expect(isPlaceholder('   ')).toBe(true);
		expect(isPlaceholder('<CHANGEME>')).toBe(true);
		expect(isPlaceholder('+336-58-02-95-39')).toBe(false);
	});
});

describe('buildOfferCatalog', () => {
	it('returns undefined for an empty catalogue', () => {
		expect(buildOfferCatalog('http://localhost', [])).toBeUndefined();
	});

	it('builds one Offer per service with a provider back-link', () => {
		const catalog = buildOfferCatalog('http://localhost', FLORIST_SERVICES);

		expect(catalog).toMatchObject({
			'@type': 'OfferCatalog',
			name: 'Services floraux',
		});
		expect(catalog!.itemListElement).toHaveLength(4);
		expect((catalog!.itemListElement as { '@type': string }[]).every((item) => item['@type'] === 'Offer')).toBe(true);
	});
});

describe('buildLocalBusiness', () => {
	it('composes the florist identity and the four-service catalogue', () => {
		const node = buildLocalBusiness({
			appUrl: 'http://localhost:3333',
			appName: 'Floralia Atelier',
			email: 'contact@floralia-atelier.fr',
			image: 'http://localhost:3333/og-image.jpg',
		});

		expect(node).toMatchObject({
			'@context': 'https://schema.org',
			'@type': 'LocalBusiness',
			'@id': 'http://localhost:3333/#business',
			name: 'Floralia Atelier',
			url: 'http://localhost:3333',
			logo: 'http://localhost:3333/logo.png',
			image: 'http://localhost:3333/og-image.jpg',
			telephone: FLORIST_IDENTITY.telephone,
			email: 'contact@floralia-atelier.fr',
			address: FLORIST_IDENTITY.address,
			priceRange: '€€',
		});
		expect(node.openingHoursSpecification).toHaveLength(1);
		expect(node.hasOfferCatalog).toMatchObject({ '@type': 'OfferCatalog', name: 'Services floraux' });
		expect((node.hasOfferCatalog as { itemListElement: unknown[] }).itemListElement).toHaveLength(4);
	});

	it('omits the email when it is a reserved example address', () => {
		const node = buildLocalBusiness({ appUrl: 'http://localhost', appName: 'Floralia', email: 'test@example.com' });

		expect(node.email).toBeUndefined();
	});

	it('omits fields that are still placeholders and the catalogue when empty', () => {
		const node = buildLocalBusiness({
			appUrl: 'http://localhost',
			appName: 'Floralia',
			image: undefined,
			identity: {
				description: '<CHANGEME>',
				telephone: '',
				priceRange: '<CHANGEME>',
			},
			services: [],
		});

		expect(node.image).toBeUndefined();
		expect(node.description).toBeUndefined();
		expect(node.telephone).toBeUndefined();
		expect(node.address).toBeUndefined();
		expect(node.openingHoursSpecification).toBeUndefined();
		expect(node.priceRange).toBeUndefined();
		expect(node.hasOfferCatalog).toBeUndefined();
	});
});

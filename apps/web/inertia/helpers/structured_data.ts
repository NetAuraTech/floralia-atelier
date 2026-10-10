/**
 * The structured-data builders of the public front.
 *
 * Pure functions producing `schema.org` JSON-LD nodes for the document head.
 * They stay in the Inertia layer (no backend imports) and take plain values —
 * the page's shared props and the florist's identity — so a page composes its
 * own head without any further data access, and each builder is unit-testable
 * in isolation.
 */

/** A JSON-LD node ready to be serialized into an `application/ld+json` script. */
export type JsonLd = Record<string, unknown>;

/** One entry in the florist's service catalogue. */
export interface FloristService {
	/** Display name of the service, e.g. `'Nettoyage de sépultures'`. */
	name: string;
	/** Short description of the service. */
	description: string;
}

/**
 * The fixed identity of the florist, emitted in the `LocalBusiness` node.
 * The business name lives on the site's `app_name` shared prop, not here.
 */
export interface FloristIdentity {
	/** Human description of the business. */
	description?: string;
	/** Public telephone number. */
	telephone?: string;
	/** `schema.org` `PostalAddress` node. */
	address?: JsonLd;
	/** `schema.org` `OpeningHoursSpecification` nodes. */
	openingHours?: JsonLd[];
	/** Price range, e.g. `'€€'`. */
	priceRange?: string;
}

/** The florist's public identity (Samer, France). */
export const FLORIST_IDENTITY: FloristIdentity = {
	description:
		"Artisan fleuriste spécialisé dans l'entretien et le fleurissement de sépultures, ainsi que les créations florales sur mesure pour mariages, baptêmes et événements.",
	telephone: '+336-58-02-95-39',
	address: {
		'@type': 'PostalAddress',
		addressLocality: 'Samer',
		postalCode: '62830',
		addressCountry: 'FR',
	},
	openingHours: [
		{
			'@type': 'OpeningHoursSpecification',
			dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			opens: '09:00',
			closes: '18:00',
		},
	],
	priceRange: '€€',
};

/** The florist's services, in the order the site presents them. */
export const FLORIST_SERVICES: FloristService[] = [
	{
		name: 'Nettoyage de sépultures',
		description: 'Nettoyage en profondeur des tombes et monuments funéraires',
	},
	{
		name: 'Fleurissement de sépultures',
		description: 'Fleurissement et entretien régulier des sépultures',
	},
	{
		name: 'Bouquets & compositions sur mesure',
		description: 'Bouquets et compositions florales réalisés sur mesure',
	},
	{
		name: "Décoration florale d'événements",
		description: 'Décoration florale pour mariages, baptêmes et événements',
	},
];

/** The sentinel rendered for an unset value; it must never leak into structured data. */
const PLACEHOLDER = '<CHANGEME>';

/**
 * Whether a value is still unset or a placeholder (empty or the `<CHANGEME>`
 * sentinel), so it must not be emitted into public structured data.
 *
 * @param value - The value to check.
 * @returns `true` when the value is absent, blank, or the sentinel.
 */
export function isPlaceholder(value: string | undefined): boolean {
	return value === undefined || value.trim() === '' || value === PLACEHOLDER;
}

/**
 * Build the `hasOfferCatalog` `OfferCatalog` node for the service catalogue.
 *
 * @param appUrl - Absolute application URL (no trailing slash).
 * @param services - The ordered service catalogue.
 * @returns The `OfferCatalog` node, or `undefined` when the catalogue is empty.
 */
export function buildOfferCatalog(appUrl: string, services: FloristService[]): JsonLd | undefined {
	if (services.length === 0) return undefined;

	return {
		'@type': 'OfferCatalog',
		name: 'Services floraux',
		itemListElement: services.map((service) => ({
			'@type': 'Offer',
			itemOffered: {
				'@type': 'Service',
				name: service.name,
				description: service.description,
				provider: { '@id': `${appUrl}/#business` },
			},
		})),
	};
}

/**
 * Build the `LocalBusiness` JSON-LD node describing the florist.
 *
 * Fields that are empty or still placeholder are omitted, so a not-yet-configured
 * deployment never leaks a sentinel into structured data. The email is omitted
 * when it is a reserved example address, and the `hasOfferCatalog` is only
 * attached when the catalogue is non-empty.
 *
 * @param opts.appUrl - Absolute application URL (no trailing slash).
 * @param opts.appName - Public site name (used as the business name).
 * @param opts.email - Contact email shared with every page.
 * @param opts.image - Absolute URL of the business image (the page's og image).
 * @param opts.identity - The florist's identity (defaults to {@link FLORIST_IDENTITY}).
 * @param opts.services - The service catalogue (defaults to {@link FLORIST_SERVICES}).
 * @returns The `LocalBusiness` node.
 *
 * @example
 * const jsonLd = buildLocalBusiness({ appUrl, appName, email, image })
 */
export function buildLocalBusiness(opts: {
	appUrl: string;
	appName: string;
	email?: string;
	image?: string;
	identity?: FloristIdentity;
	services?: FloristService[];
}): JsonLd {
	const identity = opts.identity ?? FLORIST_IDENTITY;
	const services = opts.services ?? FLORIST_SERVICES;

	const node: JsonLd = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		'@id': `${opts.appUrl}/#business`,
		name: opts.appName,
		url: opts.appUrl,
		logo: `${opts.appUrl}/logo.png`,
	};

	if (opts.image) node.image = opts.image;
	if (!isPlaceholder(identity.description)) node.description = identity.description;
	if (identity.telephone && !isPlaceholder(identity.telephone)) node.telephone = identity.telephone;
	if (opts.email && !isPlaceholder(opts.email) && !/example\.com$/i.test(opts.email)) node.email = opts.email;
	if (identity.address) node.address = identity.address;
	if (identity.openingHours && identity.openingHours.length > 0) {
		node.openingHoursSpecification = identity.openingHours;
	}
	if (identity.priceRange && !isPlaceholder(identity.priceRange)) node.priceRange = identity.priceRange;

	const catalog = buildOfferCatalog(opts.appUrl, services);
	if (catalog) node.hasOfferCatalog = catalog;

	return node;
}

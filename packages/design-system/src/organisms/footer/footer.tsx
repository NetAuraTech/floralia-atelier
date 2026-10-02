import { Link } from '@inertiajs/react';
import { cn, tv } from 'tailwind-variants';
import { Heading } from '../../atoms/heading/heading';
import { NavLink } from '../../atoms/nav_link/nav_link';
import type { ReactNode } from 'react';

const footer = tv({
	base: 'bg-primary-deep px-6 md:px-16 pt-14 pb-8',
});

/**
 * A single entry of a {@link FooterSection}.
 *
 * The `href` is resolved by the caller (e.g. with a typed `urlFor`) — the
 * footer never resolves routes itself.
 */
export interface FooterLink {
	/** Visible link text. */
	label: string;
	/** Resolved URL the link navigates to. */
	href: string;
}

/**
 * A titled group of footer links, rendered as one column.
 */
export interface FooterSection {
	/** Column heading. */
	title: string;
	/** The links of the column, rendered in order. */
	links: FooterLink[];
}

interface FooterProps {
	/**
	 * The application name, rendered as the home link. Accepts a node so the
	 * brand can carry styling (e.g. an italic accent word).
	 */
	appName: ReactNode;
	/** Resolved URL the logo link navigates to (built by the caller). */
	homeHref: string;
	/** Brand description shown under the logo. Injected by the caller. */
	description?: ReactNode;
	/**
	 * Titled link columns rendered after the brand block (e.g. the site's
	 * service pages and legal links). Omit for a footer without link columns.
	 */
	sections?: FooterSection[];
	/** Bottom-left line (e.g. the copyright notice). Injected by the caller. */
	copyright?: ReactNode;
	/** Bottom-right line (e.g. a "made by" credit). Injected by the caller. */
	credit?: ReactNode;
	/** Additional Tailwind classes merged onto the `<footer>`. */
	className?: string;
}

/**
 * Public-facing site footer.
 *
 * Lays out a brand block (logo + description) on the left, the injected link
 * columns, and a bottom row with a copyright and a credit line. All copy and
 * every link href are injected by the caller — the footer owns no app text,
 * no app name, and resolves no routes.
 *
 * @example
 * <Footer
 *   appName="Foundry"
 *   homeHref={urlFor('core.home.render')}
 *   description={<Paragraph variant="ink-inverted">…</Paragraph>}
 *   sections={[
 *     { title: 'Services', links: [{ label: '…', href: urlFor('cms.page.render', { slug: '…' }) }] },
 *   ]}
 *   copyright={<Paragraph variant="ink-inverted">© 2026 Foundry</Paragraph>}
 * />
 */
export function Footer(props: FooterProps) {
	const { appName, homeHref, description, sections, copyright, credit, className } = props;

	return (
		<footer className={cn(footer(), className)}>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pb-10 mb-8 border-b border-primary">
				<div className="col-span-2 md:col-span-1">
					<Link href={homeHref} className="text-ink-inverted font-semibold tracking-wide text-xl font-cormorant">
						{appName}
					</Link>
					{description}
				</div>
				{(sections ?? []).map((section) => (
					<div key={section.title} className="grid gap-1.5">
						<Heading level={4} color="text-secondary">
							{section.title}
						</Heading>
						{section.links.map((link) => (
							<NavLink key={link.href} href={link.href} label={link.label} variant="footer" />
						))}
					</div>
				))}
			</div>
			<div className="flex flex-col sm:flex-row items-center justify-between gap-2">
				{copyright}
				{credit}
			</div>
		</footer>
	);
}

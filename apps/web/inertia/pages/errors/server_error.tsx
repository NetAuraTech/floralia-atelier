import { Button } from '@foundry/design-system/button';
import { Heading } from '@foundry/design-system/heading';
import { Paragraph } from '@foundry/design-system/paragraph';
import { Section } from '@foundry/design-system/section';
import { urlFor } from '~/client';

/**
 * 500 error page, styled with the floralia identity.
 */
export default function ServerError() {
	return (
		<Section className="min-h-[70vh] flex items-center justify-center px-4">
			<div className="text-center max-w-md">
				<p className="font-playfair text-[6rem] leading-none text-secondary" aria-hidden="true">
					500
				</p>
				<div className="mt-4">
					<Heading level={1}>Erreur serveur</Heading>
				</div>
				<Paragraph variant="muted" spacing="base" className="mt-4">
					Une erreur est survenue. Merci de réessayer dans un instant.
				</Paragraph>
				<Button href={urlFor('core.home.render')} variant="primary" fitContent className="mt-8">
					Retour à l'accueil
				</Button>
			</div>
		</Section>
	);
}

import { SiteIntro } from './site_intro';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
	title: 'Molecules/SiteIntro',
	component: SiteIntro,
} satisfies Meta<typeof SiteIntro>;

export default meta;
type Story = StoryObj<typeof SiteIntro>;

export const Default: Story = {
	args: {
		title: (
			<>
				Floralia <span className="text-secondary italic">Atelier</span>
			</>
		),
		tagline: 'Art floral · Entretien de sépultures',
		onExit: () => {},
	},
};

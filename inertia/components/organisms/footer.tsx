import { Paragraph } from '~/components/atoms/paragraph'
import { NavLink, variants } from '~/components/atoms/nav_link'
import { Heading } from '~/components/atoms/heading'
import { Link } from '@adonisjs/inertia/react'

export function Footer() {
  return (
    <footer className="bg-primary-deep px-6 md:px-16 pt-14 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pb-10 mb-8 border-b border-primary">
        <div className="col-span-2 md:col-span-1">
          <Link
            route="page.home"
            className="text-ink-inverted font-semibold tracking-wide text-xl font-cormorant"
          >
            Floralia <span className="text-secondary italic">Atelier</span>
          </Link>
          <Paragraph
            variant="ink-inverted"
            className="text-sm font-light leading-relaxed max-w-md flex items-center gap-2"
          >
            Art floral & entretien de sépultures. Nous prenons soin des lieux de mémoire avec
            respect et délicatesse.
          </Paragraph>
        </div>
        <div className="grid gap-1.5">
          <Heading level={4} color="text-secondary">
            Services
          </Heading>
          <NavLink
            route="page.render"
            routeParams={{ slug: 'nettoyage-sepultures' }}
            label="Nettoyage de sépultures"
            variant="footer"
          />
          <NavLink
            route="page.render"
            routeParams={{ slug: 'fleurissement-sepultures' }}
            label="Fleurissement de sépultures"
            variant="footer"
          />
          <NavLink
            route="page.render"
            routeParams={{ slug: 'bouquets-compositions-sur-mesure' }}
            label="Bouquets & compositions sur mesure"
            variant="footer"
          />
          <NavLink
            route="page.render"
            routeParams={{ slug: 'decoration-florale-evenements' }}
            label="Décoration florales d'événements"
            variant="footer"
          />
        </div>
        <div className="grid gap-1.5">
          <Heading level={4} color="text-secondary">
            Infos
          </Heading>
          <NavLink route="page.home" label="Notre histoire" anchor="about" variant="footer" />
          <NavLink
            route="page.render"
            routeParams={{ slug: 'mentions-legales' }}
            label="Mentions légales"
            variant="footer"
          />
          <NavLink
            route="page.render"
            routeParams={{ slug: 'politique-de-confidentialite' }}
            label="Politique de confidentialité"
            variant="footer"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <Paragraph
          variant="ink-inverted"
          className="text-sm font-light leading-relaxed max-w-md flex items-center gap-2"
        >
          {`© 2026 Floralia Atelier — Tous droits réservés`}
        </Paragraph>
        <Paragraph
          variant="ink-inverted"
          className="text-sm font-light leading-relaxed max-w-md flex items-center gap-2"
        >
          Fait avec ♥ par{' '}
          <a href="https://www.netauratech.fr" className={`${variants['external']}`}>
            NetAuraTech
          </a>
        </Paragraph>
      </div>
    </footer>
  )
}

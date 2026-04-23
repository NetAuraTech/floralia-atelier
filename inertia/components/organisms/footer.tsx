import {Paragraph} from "~/components/atoms/paragraph";
import {NavLink, variants} from "~/components/atoms/nav_link";
import {Link} from "@adonisjs/inertia/react";
import {Heading} from "~/components/atoms/heading";

export function Footer() {
  return <footer
    className="bg-primary-deep px-6 md:px-16 pt-14 pb-8"
  >
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pb-10 mb-8 border-b border-primary">
      <div className="col-span-2 md:col-span-1">
        <Link route="home" className="text-ink-inverted font-semibold tracking-wide text-xl font-cormorant">
          Floralia <span className="text-secondary italic">Atelier</span>
        </Link>
        <Paragraph variant="ink-inverted" className="text-sm font-light leading-relaxed max-w-md flex items-center gap-2">
          Art floral & entretien de sépultures. Nous prenons soin des lieux de mémoire avec respect et délicatesse.
        </Paragraph>
      </div>
      <div>
        <Heading level={4} color="text-secondary">
          Services
        </Heading>
        <NavLink
          route="home"
          label="Nettoyage"
          variant="footer"
        />
        <NavLink
          route="home"
          label="Fleurissement"
          variant="footer"
        />
        <NavLink
          route="home"
          label="Abonnements"
          variant="footer"
        />
        <NavLink
          route="home"
          label="Bouquets"
          variant="footer"
        />
      </div>
      <div>
        <Heading level={4} color="text-secondary">
          Infos
        </Heading>
        <NavLink
          route="home"
          label="Notre histoire"
          variant="footer"
        />
        <NavLink
          route="home"
          label="Tarifs"
          variant="footer"
        />
        <NavLink
          route="home"
          label="Mentions légales"
          variant="footer"
        />
        <NavLink
          route="home"
          label="Confidentialité"
          variant="footer"
        />
      </div>
    </div>
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
      <Paragraph variant="ink-inverted" className="text-sm font-light leading-relaxed max-w-md flex items-center gap-2">
        {`© 2026 Floralia Atelier — Tous droits réservés`}
      </Paragraph>
      <Paragraph variant="ink-inverted" className="text-sm font-light leading-relaxed max-w-md flex items-center gap-2">
        Fait avec ♥ par <a href="https://www.netauratech.fr" className={`${variants['external']}`}>NetAuraTech</a>
      </Paragraph>
    </div>
  </footer>
}

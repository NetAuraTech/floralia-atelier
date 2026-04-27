import { Section } from '~/components/atoms/section'
import { Helmet as Head } from 'react-helmet-async'
import { Paragraph } from "~/components/atoms/paragraph";
import { Heading } from "~/components/atoms/heading";
import { Button } from "~/components/atoms/button";
import { NavLink } from "~/components/atoms/nav_link";
import {useScrollReveal} from "~/hooks/use_scroll_reveal";
import { Field } from "~/components/molecules/field";
import {SelectOption} from "~/components/atoms/select_option";
import {Icon} from "~/components/atoms/icon";

export default function Home() {
  const reveal = useScrollReveal()

  return (
    <>
      <Head title="Fleuriste artisan | Sépulture & créations sur mesure" />
      <Section
        className="min-h-screen grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-16 gap-10 md:gap-16 relative overflow-hidden pt-28 md:pt-24 pb-16 md:pb-0"
      >
        <div ref={reveal} className="relative reveal order-2 md:order-1 max-w-2xl">
          <Paragraph variant="custom" color="text-secondary" className="flex tracking-[.35em] uppercase items-center gap-3 text-xs mb-5">
            <span className="block w-8 h-px bg-secondary" />
            Artisan floral depuis 2026
          </Paragraph>
          <Heading level={1}>
            Honorer ceux qui nous sont <em className="text-tertiary">chers</em>,<br/> célébrer ce qui compte <em className="text-terciary">vraiment</em>
          </Heading>
          <Paragraph spacing="xl" variant="subtle" className="leading-relaxed mb-7">
            Entretien et fleurissement de sépultures, bouquets de mariée, centres de table et compositions florale sur mesure. Floralia  <span className="text-secondary italic">Atelier</span> met l'art floral au service de vos moments les plus précieux
          </Paragraph>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <NavLink
              route="page.home"
              anchor="services"
              label="Nos services"
            />
            <NavLink
              route="page.home"
              anchor="services"
              label="Voir nos création"
            >
              <span className="group-hover:translate-x-1 transition-transform ml-1">→</span>
            </NavLink>
          </div>
        </div>
        <div ref={reveal} className="flex justify-center items-center reveal order-1 md:order-2">
          <div className="relative">
            <div
              className="bg-primary-deep flex flex-col items-center justify-center relative overflow-hidden w-[min(340px,80vw)] h-[min(430px,100vw)]">
              <svg width="260" height="340" viewBox="0 0 260 340" fill="none">
                <path d="M97 315 Q75 293 73 252 Q70 193 130 175 Q190 193 187 252 Q184 293 163 315 Z" fill="#2D5240"
                      opacity=".8"/>
                <ellipse cx="130" cy="315" rx="32" ry="6.5" fill="#1B3529"/>
                <path d="M97 280 Q130 269 163 280" stroke="#4A7A60" stroke-width=".8" fill="none"/>
                <g className="br-c">
                  <path d="M130 177 C130 140 130 105 130 74" stroke="#4A7A60" stroke-width="2" stroke-linecap="round"/>
                  <g transform="translate(130,74)">
                    <g>
                      <ellipse cx="0" cy="-13" rx="9" ry="12" fill="#E8A898"/>
                      <ellipse cx="0" cy="-13" rx="9" ry="12" fill="#E8A898" transform="rotate(51.4)"/>
                      <ellipse cx="0" cy="-13" rx="9" ry="12" fill="#E8A898" transform="rotate(102.8)"/>
                      <ellipse cx="0" cy="-13" rx="9" ry="12" fill="#E8A898" transform="rotate(154.2)"/>
                      <ellipse cx="0" cy="-13" rx="9" ry="12" fill="#E8A898" transform="rotate(205.6)"/>
                      <ellipse cx="0" cy="-13" rx="9" ry="12" fill="#E8A898" transform="rotate(257)"/>
                      <ellipse cx="0" cy="-13" rx="9" ry="12" fill="#E8A898" transform="rotate(308.4)"/>
                      <circle cx="0" cy="0" r="8" fill="#D4A0A0"/>
                      <circle cx="0" cy="0" r="4" fill="#C48888"/>
                    </g>
                  </g>
                </g>
                <g className="br-l1">
                  <path d="M130 180 C124 152 111 122 94 96" stroke="#4A7A60" stroke-width="1.8" stroke-linecap="round"/>
                  <ellipse cx="111" cy="150" rx="14" ry="6" fill="#3A6248" transform="rotate(-35,111,150)"/>
                  <g transform="translate(94,96)">
                    <g>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#C8A8C8"/>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#C8A8C8" transform="rotate(60)"/>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#C8A8C8" transform="rotate(120)"/>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#C8A8C8" transform="rotate(180)"/>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#C8A8C8" transform="rotate(240)"/>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#C8A8C8" transform="rotate(300)"/>
                      <circle cx="0" cy="0" r="6" fill="#DCC0DC"/>
                    </g>
                  </g>
                </g>
                <g className="br-r1">
                  <path d="M130 180 C136 152 149 122 166 96" stroke="#4A7A60" stroke-width="1.8"
                        stroke-linecap="round"/>
                  <ellipse cx="149" cy="150" rx="14" ry="6" fill="#3A6248" transform="rotate(35,149,150)"/>
                  <g transform="translate(166,96)">
                    <g>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#D4C0A0"/>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#D4C0A0" transform="rotate(60)"/>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#D4C0A0" transform="rotate(120)"/>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#D4C0A0" transform="rotate(180)"/>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#D4C0A0" transform="rotate(240)"/>
                      <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#D4C0A0" transform="rotate(300)"/>
                      <circle cx="0" cy="0" r="6" fill="#C8B090"/>
                    </g>
                  </g>
                </g>
                <g className="br-l2">
                  <path d="M129 183 C118 158 99 133 73 113" stroke="#4A7A60" stroke-width="1.5" stroke-linecap="round"/>
                  <g transform="translate(73,113)">
                    <g>
                      <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#A8C8B8"/>
                      <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#A8C8B8" transform="rotate(72)"/>
                      <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#A8C8B8" transform="rotate(144)"/>
                      <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#A8C8B8" transform="rotate(216)"/>
                      <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#A8C8B8" transform="rotate(288)"/>
                      <circle cx="0" cy="0" r="4" fill="#88B098"/>
                    </g>
                  </g>
                </g>
                <g className="br-r2">
                  <path d="M131 183 C142 158 161 133 187 113" stroke="#4A7A60" stroke-width="1.5"
                        stroke-linecap="round"/>
                  <g transform="translate(187,113)">
                    <g>
                      <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#F0C8A0"/>
                      <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#F0C8A0" transform="rotate(72)"/>
                      <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#F0C8A0" transform="rotate(144)"/>
                      <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#F0C8A0" transform="rotate(216)"/>
                      <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#F0C8A0" transform="rotate(288)"/>
                      <circle cx="0" cy="0" r="4" fill="#E0B888"/>
                    </g>
                  </g>
                </g>
              </svg>
              <Paragraph variant="custom" color="text-secondary-light" className="font-cormorant italic tracking-widder uppercase flex items-center gap-3">
                Art floral & Souvenir
              </Paragraph>
            </div>
          </div>
        </div>
      </Section>
      <Section
        id="services"
        className="py-20 md:py-28 px-6 md:px-16 bg-surface"
      >
        <div ref={reveal} className="flex flex-col items-center reveal mb-12 md:mb-16">
          <Paragraph variant="custom" color="text-secondary" className="tracking-[.35em] uppercase items-center gap-3 text-xs mb-3.5">
            Ce que nous proposons
          </Paragraph>
          <Heading level={2}>
            Nos <em className="text-tertiary">prestations</em>
          </Heading>
          <Paragraph spacing="sm" variant="subtle" className="leading-relaxed max-w-md">
            Deux savoir-faire distincts, une même exigence artisanale : prendre soin de ce qui compte pour vous.
          </Paragraph>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5">
          <div
            ref={reveal}
            className="reveal group relative bg-canvas p-8 md:p-12 overflow-hidden hover:-translate-y-1.5 transition-transform duration-300">
            <span
              className="absolute top-5 right-6 font-cormorant select-none pointer-events-none text-6xl text-secondary-light">01</span>
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"/>
            <div className="text-primary-deep mb-6">
              <Icon name="Bubbles" size={40} />
            </div>
            <Heading level={3}>
              Nettoyage de sépultures
            </Heading>
            <Paragraph variant="subtle" className="leading-relaxed max-w-md mb-5">
              Entretien complet du monument funéraire : démoussage, nettoyage du granit ou du marbre. Votre sépulture retrouve sa dignité. Intervention ponctuelle ou abonnement annuel disponible.
            </Paragraph>
            <NavLink
              route="page.home"
              label="En savoir plus"
            >
              <span className="group-hover:translate-x-1 transition-transform ml-1">→</span>
            </NavLink>
          </div>
          <div
            ref={reveal}
            className="reveal group relative bg-canvas p-8 md:p-12 overflow-hidden hover:-translate-y-1.5 transition-transform duration-300">
            <span
              className="absolute top-5 right-6 font-cormorant select-none pointer-events-none text-6xl text-secondary-light">02</span>
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"/>
            <div className="text-primary-deep mb-6">
              <Icon name="Flower2" size={40} />
            </div>
            <Heading level={3}>
              Fleurissement de sépultures
            </Heading>
            <Paragraph variant="subtle" className="leading-relaxed max-w-md mb-5">
              Compositions fraîches, renouvelées selon vos souhaits tout au long de l'année. Abonnement planifiés sur les dates qui vous tiennent à cœur: Toussaint, anniversaires, fêtes.
            </Paragraph>
            <NavLink
              route="page.home"
              label="En savoir plus"
            >
              <span className="group-hover:translate-x-1 transition-transform ml-1">→</span>
            </NavLink>
          </div>
          <div
            ref={reveal}
            className="reveal group relative bg-canvas p-8 md:p-12 overflow-hidden hover:-translate-y-1.5 transition-transform duration-300">
            <span
              className="absolute top-5 right-6 font-cormorant select-none pointer-events-none text-6xl text-secondary-light">03</span>
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"/>
            <div className="text-primary-deep mb-6">
              <Icon name="Rose" size={40} />
            </div>
            <Heading level={3}>
              Bouquets & compositions sur mesure
            </Heading>
            <Paragraph variant="subtle" className="leading-relaxed max-w-md mb-5">
              Bouquet de mariés, brassé champêtre, composition d'anniversaire ou de naissance... Chaque bouquet est imaginé selon vos couleurs, vos envies et la saison.
            </Paragraph>
            <NavLink
              route="page.home"
              label="En savoir plus"
            >
              <span className="group-hover:translate-x-1 transition-transform ml-1">→</span>
            </NavLink>
          </div>
          <div
            ref={reveal}
            className="reveal group relative bg-canvas p-8 md:p-12 overflow-hidden hover:-translate-y-1.5 transition-transform duration-300">
            <span
              className="absolute top-5 right-6 font-cormorant select-none pointer-events-none text-6xl text-secondary-light">03</span>
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"/>
            <div className="text-primary-deep mb-6">
              <Icon name="Balloon" size={40} />
            </div>
            <Heading level={3}>
              Décoration florale d'événements
            </Heading>
            <Paragraph variant="subtle" className="leading-relaxed max-w-md mb-5">
              Centres de table, arche florales, chemins de table pour mariages, baptêmes, communions, anniversaires. Un rendu unique, pensés en cohérence avec votre thème.
            </Paragraph>
            <NavLink
              route="page.home"
              label="En savoir plus"
            >
              <span className="group-hover:translate-x-1 transition-transform ml-1">→</span>
            </NavLink>
          </div>
        </div>
      </Section>
      <Section
        id="about"
        className="py-20 md:py-28 px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center"
      >
        <div ref={reveal} className="relative reveal mx-auto md:mx-0 w-[min(340px,100%)]">
          <div className="bg-primary-deep flex items-center justify-center w-full h-105">
            <Paragraph variant="custom" color="text-primary-light" className="leading-relaxed max-w-md text-[clamp(.9rem,2.5vw,1.05rem)] text-center font-cormorant italic">
              « Chaque fleur posée
              <br/>
              est une parole
              <br/>
              que les mots
              <br/>
              ne savent pas dire »
            </Paragraph>
          </div>
          <div className="absolute flex items-center text-center p-6 bg-tertiary-light -right-5 md:-right-8 -bottom-12 w-38 h-48 border-6 border-canvas">
            <span className="font-cormorant italic text-primary-deep leading-snug text-sm">
              Art floral & savoir-fair artisanal
            </span>
          </div>
          <div className="absolute py-4 px-5 bg-secondary -left-5 top-8 max-w-45">
            <span className="font-cormorant text-ink-inverted leading-snug text-sm italic">
              Passion & respect depuis 2026
            </span>
          </div>
        </div>
        <div ref={reveal} className="reveal">
          <Paragraph variant="custom" color="text-secondary" className="tracking-[.35em] uppercase items-center gap-3 text-xs mb-3.5">
            Notre histoire
          </Paragraph>
          <Heading level={2}>
            Un métier de <em className="text-tertiary">cœur</em>
          </Heading>
          <Paragraph spacing="sm" variant="subtle" className="leading-relaxed max-w-md">
             Née d'une passion profonde pour les fleurs et les instants qui compte, Floralia  <span className="text-secondary italic">Atelier</span> œuvre sur deu terrains du quotidien : l'hommage à ceux qui nous ont quittés, et la célébration de ceux qui sont là.
          </Paragraph>
          <Paragraph variant="subtle" className="leading-relaxed max-w-md">
            Nous intervenons avec discrétion et soin dans les cimetières pour l'entretien des sépultures, et créons dans notre atelier des compositions florales sur mesure pour vos événements (mariages, baptêmes, anniversaires, fêtes de famille).
          </Paragraph>
          <Paragraph variant="subtle" className="leading-relaxed max-w-md">
            Ce qui nous réunit ? La conviction que les fleurs ont le pouvoir de dire ce que le smots ne peuvent pas.
          </Paragraph>
          <Paragraph variant="custom" color="text-primary-deep" fs="sm" className="font-cormorant italic flex items-center gap-3">
            <span className="block w-8 h-px bg-primary-deep" />
            Magali, artisan florale
          </Paragraph>
        </div>
      </Section>
      <Section
        id="creations"
        className="py-20 md:py-28 px-6 md:px-16 bg-primary-deep"
      >
        <div ref={reveal} className="flex flex-col items-center reveal mb-12 md:mb-16">
          <Paragraph variant="custom" color="text-secondary" className="tracking-[.35em] uppercase items-center gap-3 text-xs mb-3.5">
            Portfolio
          </Paragraph>
          <Heading level={2} color="text-ink-inverted">
            Nos <em className="text-tertiary">créations</em>
          </Heading>
          <Paragraph spacing="sm" variant="custom" color="text-primary-light" className="leading-relaxed max-w-md">
            De la sépulture fleurie au bouquet de mariée, chaque composition raconte une histoire unique.
          </Paragraph>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          <div ref={reveal} className="reveal relative p-9 flex flex-col justify-end bg-primary transition-colors duration-300 min-h-45 md:min-h-108">
            <span className="inline-block border px-4 py-1 mb-3 tracking-widest uppercase text-secondary text-xs">Bouquet signature</span>
            <Heading level={4} color="text-ink-inverted">
              Fleurissement sépultures
            </Heading>
            <Paragraph spacing="sm" variant="custom" color="text-primary-light" className="leading-relaxed max-w-md">
              Compositions saisonnières renouvelées.
            </Paragraph>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            <div ref={reveal} className="reveal relative p-9 flex flex-col justify-end bg-primary transition-colors duration-300 min-h-35 md:min-h-50">
              <span className="inline-block border px-4 py-1 mb-3 tracking-widest uppercase text-secondary text-xs">Bouquet signature</span>
              <Heading level={4} color="text-ink-inverted">
                Bouquet de mariée
              </Heading>
              <Paragraph spacing="sm" variant="custom" color="text-primary-light" className="leading-relaxed max-w-md">
                Du champêtre au contemporain.
              </Paragraph>
            </div>
            <div ref={reveal} className="reveal relative p-9 flex flex-col justify-end bg-primary transition-colors duration-300 min-h-35 md:min-h-50">
              <span className="inline-block border px-4 py-1 mb-3 tracking-widest uppercase text-secondary text-xs">Bouquet signature</span>
              <Heading level={4} color="text-ink-inverted">
                Centres de table
              </Heading>
              <Paragraph spacing="sm" variant="custom" color="text-primary-light" className="leading-relaxed max-w-md">
                Mariage, baptême, événement.
              </Paragraph>
            </div>
            <div ref={reveal} className="reveal relative p-9 flex flex-col justify-end bg-primary transition-colors duration-300 min-h-35 md:min-h-50">
              <span className="inline-block border px-4 py-1 mb-3 tracking-widest uppercase text-secondary text-xs">Bouquet signature</span>
              <Heading level={4} color="text-ink-inverted">
                Composition libres
              </Heading>
              <Paragraph spacing="sm" variant="custom" color="text-primary-light" className="leading-relaxed max-w-md">
                Naissance, anniversaire, cadeau.
              </Paragraph>
            </div>
            <div ref={reveal} className="reveal relative p-9 flex flex-col justify-end bg-primary transition-colors duration-300 min-h-35 md:min-h-50">
              <span className="inline-block border px-4 py-1 mb-3 tracking-widest uppercase text-secondary text-xs">Bouquet signature</span>
              <Heading level={4} color="text-ink-inverted">
                Couronnes & gerbes
              </Heading>
              <Paragraph spacing="sm" variant="custom" color="text-primary-light" className="leading-relaxed max-w-md">
                Pour accompagner les cérémonies.
              </Paragraph>
            </div>
          </div>
        </div>
      </Section>
      <Section
        className="py-20 md:py-28 px-6 md:px-16"
      >
        <div ref={reveal} className="flex flex-col items-center reveal mb-12 md:mb-16">
          <Paragraph variant="custom" color="text-secondary" className="tracking-[.35em] uppercase items-center gap-3 text-xs mb-3.5">
            Comment ça marche ?
          </Paragraph>
          <Heading level={2}>
            Un accompagnement <em className="text-tertiary">simple</em>
          </Heading>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div ref={reveal} className="reveal text-center px-2 md:px-4">
            <p
              className="font-cormorant leading-none text-6xl text-secondary mb-3">01</p>
            <div className="w-7 h-px bg-secondary mx-auto mb-4" />
            <Heading level={4}>
              Contact & échange
            </Heading>
            <Paragraph spacing="sm" variant="subtle" className="leading-relaxed md:px-25">
              Nous prennons le temps d'écouter votre demande, entretien de sépulture ou ptojet florale, sans jugement ni précipitation.
            </Paragraph>
          </div>
          <div ref={reveal} className="reveal text-center px-2 md:px-4">
            <p
              className="font-cormorant leading-none text-6xl text-secondary mb-3">02</p>
            <div className="w-7 h-px bg-secondary mx-auto mb-4" />
            <Heading level={4}>
              Devis personnalisé
            </Heading>
            <Paragraph spacing="sm" variant="subtle" className="leading-relaxed md:px-25">
              Une proposition claire et détaillés, adaptée à votre budget et à vos envies. Sans surprise.
            </Paragraph>
          </div>
          <div ref={reveal} className="reveal text-center px-2 md:px-4">
            <p
              className="font-cormorant leading-none text-6xl text-secondary mb-3">03</p>
            <div className="w-7 h-px bg-secondary mx-auto mb-4" />
            <Heading level={4}>
              Création & intervention
            </Heading>
            <Paragraph spacing="sm" variant="subtle" className="leading-relaxed md:px-25">
              Réalisation soignée dans les délais convenus, avec tout le savoir-faire de notre atelier artisanal.
            </Paragraph>
          </div>
          <div ref={reveal} className="reveal text-center px-2 md:px-4">
            <p
              className="font-cormorant leading-none text-6xl text-secondary mb-3">04</p>
            <div className="w-7 h-px bg-secondary mx-auto mb-4" />
            <Heading level={4}>
              Suivi
            </Heading>
            <Paragraph spacing="sm" variant="subtle" className="leading-relaxed md:px-25">
              Photos d'intervention pour les sépultures sur demande. Échanges continus pour affiner vos créations florales.
            </Paragraph>
          </div>
        </div>
      </Section>
      <Section
        className="py-20 md:py-28 px-6 md:px-16 bg-tertiary-light text-center"
      >
        <p className="text-primary tracking-widest mb-5 text-sm">★ ★ ★ ★ ★</p>
        <blockquote className="font-cormorant italic text-primary-deep leading-relaxed max-w-2xl mx-auto mb-5 text-[clamp(1.2rem,3vw,1.65rem)]">
          « Grâce à Floralia  <span className="text-secondary italic">Atelier</span>, la tombe de ma mère est toujours fleurie et entretenue, même quand je ne peux pas me déplacer. Un service d'une rare délicatesse. »
        </blockquote>
        <p className="font-jost tracking-[.25em] uppercase text-primary text-xs">— Sophie R., cliente depuis 3 ans</p>
      </Section>
      <Section
        id="contact"
        className="py-20 md:py-28 px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start bg-surface"
      >
        <div ref={reveal} className="reveal">
          <Paragraph variant="custom" color="text-secondary" className="tracking-[.35em] uppercase items-center gap-3 text-xs mb-3.5">
            Nous contacter
          </Paragraph>
          <Heading level={2}>
            Parlons de votre <em className="text-tertiary">projet</em>
          </Heading>
          <Paragraph spacing="sm" variant="subtle" className="leading-relaxed max-w-md mb-5">
            Entretien de sépulture ou création florale sur mesure, décrivez-nous votre projet. Nous vous répondrons sous 48h avec un devis gratuit.
          </Paragraph>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-13 h-13 text-ink-inverted bg-primary-deep flex items-center justify-center">
              <Icon name="MapPin" size={18} />
            </div>
            <Paragraph spacing="xs" variant="subtle" className="leading-relaxed max-w-md">
              62830 Samer
              <br/>
              Interventions jusqu'à 20km
            </Paragraph>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-13 h-13 text-ink-inverted bg-primary-deep flex items-center justify-center">
              <Icon name="Phone" size={18} />
            </div>
            <Paragraph spacing="xs" variant="subtle" className="leading-relaxed max-w-md">
              06 00 00 00 00
              <br/>
              Du Lundi au Samedi, 9h-18h
            </Paragraph>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 text-ink-inverted bg-primary-deep flex items-center justify-center">
              <Icon name="Mail" size={18} />
            </div>
            <Paragraph spacing="xs" variant="subtle" className="leading-relaxed max-w-md">
              contact@floralia-atelier.fr
            </Paragraph>
          </div>
        </div>
        <div ref={reveal} className="reveal">
          <form className="grid gap-4" action="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Prénom"
                placeholder="Marie"
                name="firstname"
                type="text"
                required
              />
              <Field
                label="Nom"
                placeholder="Dupont"
                name="lastname"
                type="text"
                required
              />
            </div>
            <Field
              label="Email"
              placeholder="marie@exemple.fr"
              name="email"
              type="email"
              required
            />
            <Field
              label="Service souhaité"
              placeholder="Choisir ..."
              name="service"
              type="select"
              required
            >
              <SelectOption label="Nettoyage de sépulture" value="cleaning" />
              <SelectOption label="Fleurissement de sépulture" value="decorations" />
              <SelectOption label="Abonnement entretien" value="subscription" />
              <SelectOption label="Mariage" value="wedding" />
              <SelectOption label="Baptême" value="bapteme" />
              <SelectOption label="Anniversaire" value="anniversaire" />
              <SelectOption label="Autre événement" value="autre-evenement" />
              <SelectOption label="Bouquet cadeau" value="bouquet-cadeau" />
              <SelectOption label="Autre demande" value="autre" />
            </Field>
            <Field
              label="Message"
              placeholder="Dites-nous en quelques mots votre projet : date, lieu, ambiance souhaitée, nobre de tables, localisation du cimetière..."
              name="message"
              type="textarea"
              required
            />
            <Button variant="primary" type="submit">
              Envoyer ma demande
            </Button>
          </form>
        </div>
      </Section>
    </>
  )
}

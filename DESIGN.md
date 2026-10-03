# Design System — the floralia visual identity

The public site of Floral Atelier carries a calm, editorial identity: a warm
off-white canvas, deep botanical greens with an olive-gold accent, serif
display type over a humanist sans body, French copy throughout, and an
animated logo intro on the first load. This file documents the identity as
shipped on the Foundry 2.1 baseline.

The admin panel reuses the same tokens but is a separate surface; this file
covers the public site. Component conventions (atoms/molecules/organisms, the
`@foundry/design-system` package) live in `docs/agents/design-system.md`.

## Where the identity lives

| Concern                          | Location                                                                                                                         |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Design tokens (colors, fonts)    | `packages/design-system/src/css/canonical.css` — the canonical `@theme` block                                                    |
| App copy of the tokens           | `apps/web/inertia/css/app.css` — a lockstep copy plus the app-only annexes (`@layer base`, `@source`); **keep both in sync**     |
| Presentation type surface        | `packages/design-system/src/tokens.ts` — `FontSize`, `ParagraphVariants`, `ParagraphSpacing`                                     |
| Public layout & SEO chrome       | `apps/web/inertia/layouts/default.tsx`                                                                                           |
| Page SEO + LocalBusiness JSON-LD | `apps/web/inertia/pages/cms/page/front/show.tsx`                                                                                 |
| Intro animation                  | `packages/design-system/src/molecules/site_intro/site_intro.tsx` + the intro CSS in `canonical.css` (lockstep copy in `app.css`) |
| Error pages                      | `apps/web/inertia/pages/errors/not_found.tsx`, `server_error.tsx`                                                                |

## Brand

- **Wordmark** — `Floralia Atelier`, with `Atelier` set in italic `text-secondary` (olive gold). Rendered as a styled node in the layout (`default.tsx`) and injected into the `Header`, `Footer` and `SiteIntro` via their `appName` / `title` props.
- **Tagline** — `Art floral · Entretien de sépultures` (intro tagline, footer description).
- **Logo** — `/logo.png` (line art) and `/logo-color.png` (color version); the intro draws the line art then colorizes it.
- The layout is French: `lang`, `og:locale` (`fr_FR`), geo tags (`FR-62`, `Samer`) and all chrome copy.

## Palette

All colors are OKLCH tokens in the `@theme` block (`canonical.css`). The
vocabulary: botanical greens (`primary`), olive gold (`secondary`),
terracotta (`tertiary`), near-neutral warm inks, and a warm canvas.

| Token                                                | Value                                      | Role                                                     |
| ---------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| `primary-deep`                                       | `oklch(0.3038 0.0392 162.91)`              | Darkest green — intro title, emphasis on dark            |
| `primary`                                            | `oklch(0.4049 0.0528 161.65)`              | Main green — primary buttons, links                      |
| `primary-soft`                                       | `oklch(0.5373 0.0669 159.37)`              | Mid green                                                |
| `primary-light`                                      | `oklch(0.7959 0.043 153.88)`               | Tinted green                                             |
| `secondary` / `-deep` / `-soft`                      | `oklch(0.7294 0.0887 81.25)`               | Olive gold — the accent word, error numerals, highlights |
| `secondary-light`                                    | `oklch(0.8507 0.0623 82.99)`               | Lighter gold (hover)                                     |
| `tertiary`                                           | `oklch(0.7543 0.0621 18.63)`               | Terracotta                                               |
| `tertiary-light`                                     | `oklch(0.9019 0.0267 17.66)`               | Tinted terracotta                                        |
| `ink`                                                | `oklch(0.162 0.014 258.363)`               | Body text on light                                       |
| `ink-muted` / `ink-subtle`                           | `oklch(0.4 …)` / `oklch(0.6 …)`            | Secondary / tertiary text on light                       |
| `ink-inverted` (+muted/subtle)                       | `oklch(0.97 0.005 263)` …                  | Text on dark surfaces (footer)                           |
| `canvas`                                             | `oklch(0.974 0.0114 84.58)`                | Warm off-white page background                           |
| `surface`                                            | `oklch(0.9322 0.0226 87.15)`               | Card / intro background                                  |
| `sunken` / `overlay` / `raised`                      | `oklch(0.94 …)` / `oklch(0.995 …)` / white | Inputs, overlays, elevated surfaces                      |
| `edge` / `edge-strong`                               | `oklch(0.82 …)` / `oklch(0.65 …)`          | Borders                                                  |
| `success` / `warning` / `danger` / `info` (+`-soft`) | e.g. `oklch(0.55 0.15 145)`                | Status colors (toasts, badges)                           |

## Typography

Three families, self-hosted via `@fontsource` `@import`s in the canonical CSS
(not JS imports):

| Token            | Family             | Used for                                                                      |
| ---------------- | ------------------ | ----------------------------------------------------------------------------- |
| `font-jost`      | Jost (sans)        | Default body font (`@layer base` on `body`), UI text, buttons, forms          |
| `font-playfair`  | Playfair Display   | All headings (the `heading` atom's base), the intro title, the error numerals |
| `font-cormorant` | Cormorant Garamond | The brand wordmark (header & footer logo), external nav links                 |

The `paragraph` / `heading` atoms expose the type scale through the
`FontSize` / `ParagraphVariants` / `ParagraphSpacing` tokens
(`packages/design-system/src/tokens.ts`); sizes are responsive-capable
(`'md:xl'`, arrays of breakpoint overrides).

## The intro animation

`SiteIntro` (`@foundry/design-system/site-intro`) is a full-screen overlay
that plays **once, on the initial page load** — the layout persists across
Inertia visits, so it never replays on navigation:

1. **Play (3600 ms)** — the SVG logo self-draws: each path animates its
   `stroke-dashoffset` (the `draw` keyframe fills the stroke at 40 % → 80 %
   of the run), then the color logo `/logo-color.png` fades in (`colorize`,
   delayed 1800 ms). The wordmark + tagline reveal at 2.2 s (`nameReveal`).
2. **Exit (1100 ms)** — at 3600 ms the `exit` class adds the circular
   clip-path collapse (`circOut`, `circle(150%) → circle(0%)`); the layout's
   `onExit` callback reveals the site (`#site` gains `visible`) so the site
   fades in as the intro clips away.
3. **Unmount** — at 3600 + 1100 ms the molecule unmounts itself.

The animation CSS (`#intro`, `#svg_logo`, `.nameIn`, the keyframes, the
`--len` property) lives in the package's `canonical.css` with a lockstep copy
in `apps/web/inertia/css/app.css`. A `<noscript>` style forces `#site`
visible when JS is off. The timing is fixed to the authored logo animation —
don't reschedule it in the component without re-authoring the CSS.

## One-page navigation

The public site is a single page: the homepage holds the content sections
(`#services`, `#about`, `#creations`, `#contact`), and the chrome navigates
to them:

- **Header** (`@foundry/design-system/header`) — brand wordmark linking to
  the home (`core.home.render`), four anchor links (Services, Histoire,
  Créations, Contact) into the homepage sections, and a controlled mobile
  menu (the layout owns the open/close state and closes on navigation; the
  package never subscribes to the Inertia router itself).
- **Footer** (`@foundry/design-system/footer`) — brand, description, two link
  sections built from CMS Page slugs (the four Service pages; the history
  anchor + the two legal pages), copyright and the credits line.
- **Catch-all ordering** — the CMS page-render catch-alls register last
  (`apps/web/start/routes.ts`) so the anchors and single-segment routes are
  never shadowed.

## Error pages

404 and 500 (`inertia/pages/errors/`) carry the floralia identity: a large
Playfair numeral in `text-secondary`, French copy (`Page introuvable`,
`Erreur serveur`), and a primary button back to the homepage.

## SEO chrome

- **Layout head** (`default.tsx`) — canonical URL, robots, Open Graph
  (`og:locale fr_FR`, `og:site_name`), geo tags (`geo.region FR-62`,
  `geo.placename Samer`), favicons + web manifest, Twitter card.
- **Page head** (`cms/page/front/show.tsx`) — per-page
  `metaTitle`/`metaDescription`/`metaImage` with fallbacks (title, and
  `/og-image.jpg` for the image), plus the florist's `LocalBusiness`
  JSON-LD: name, phone, email, Samer address, opening hours (Mon–Sat
  09:00–18:00), price range, and the Services offer catalog.

## Changing the identity

- A token change edits `canonical.css` **and** its lockstep copy in
  `apps/web/inertia/css/app.css` (same block, keep them in sync).
- New shared presentation types go to `packages/design-system/src/tokens.ts`,
  never duplicated in the app.
- Chrome (wordmark, nav links, footer sections, tagline) lives in
  `apps/web/inertia/layouts/default.tsx` — the organisms stay content-free.
- Verify with `npm run typecheck` and `npm run lint`; for visual changes,
  check the running dev server (`npm run dev`) and, for package components,
  Storybook (`npm run storybook --workspace @foundry/design-system`).

# Floral Atelier

The website of **Floral Atelier**, a florist (art floral & entretien de sépultures) based in Samer, France. It is a CMS-driven public site built on the **Foundry 2.1** full flavor: an AdonisJS v7 + Inertia/React application with a headless CMS, a visual page builder, and a complete admin panel.

## What's in the box

- **Public site** — a one-page, CMS-driven front: the homepage holds the `#services`, `#about`, `#creations` and `#contact` sections; service and legal pages are rendered by slug (`/:slug`, `/:locale/:slug`). The animated logo intro, the one-page navigation, the SEO head and the `LocalBusiness` JSON-LD make up the floralia identity — see [DESIGN.md](DESIGN.md).
- **Contact form** — a `contact_form` block on the homepage posts to `POST /contact` (throttled 5/hour); the submission is mailed to the florist (`MAIL_FROM_ADDRESS`).
- **Media library** — the admin Files screen (`/admin/files`): upload, folder organization, per-locale named alt text, responsive WebP image variants. Pages reference files through `FileRef` blocks.
- **Admin panel** (`/admin`) — page management with the visual page builder (real-time collaboration, field locking, revisions), templates, users/roles/permissions, log viewer, maintenance mode.
- **Platform** — session auth (2FA, OAuth), opt-in API tokens, Redis cache and job queue, PostgreSQL, Drive storage (local/S3/R2), database backups, structured logging, Sentry, OpenAPI reference.

## Tech stack

| Category          | Technology                                                                           |
| ----------------- | ------------------------------------------------------------------------------------ |
| **Backend**       | AdonisJS v7, Lucid ORM, VineJS                                                       |
| **Frontend**      | React 19, Inertia.js (SSR), Tailwind CSS v4                                          |
| **Language**      | TypeScript 5.9                                                                       |
| **Database**      | PostgreSQL (primary), SQLite (dev)                                                   |
| **Cache / Queue** | Redis (`@adonisjs/queue`, worker process)                                            |
| **Auth**          | Session-based (`@adonisjs/auth`), OAuth (`@adonisjs/ally`), opt-in API tokens        |
| **Storage**       | `@adonisjs/drive` (local FS, S3, Cloudflare R2), Sharp image variants                |
| **Real-Time**     | `@adonisjs/transmit` (SSE)                                                           |
| **Monitoring**    | Sentry (`@sentry/node` + `@sentry/react`)                                            |
| **Testing**       | Japa (backend), Vitest (frontend)                                                    |
| **Design System** | `@foundry/design-system` (shared React workspace: tokens, atoms/molecules/organisms) |
| **Lint / Format** | oxlint / oxfmt (repo root)                                                           |

## Quick start

### Requirements

| Tool    | Version     |
| ------- | ----------- |
| Node.js | >= 24.x     |
| npm     | >= 11.x     |
| Docker  | (dev infra) |

### Installation

```bash
# Clone the repository
git clone https://github.com/NetAuraTech/floralia-atelier.git
cd floralia-atelier

# Install dependencies (single lockfile at the repo root)
npm install

# Start the development infrastructure (PostgreSQL, Redis, MailHog, Typesense)
docker compose up -d

# Configure the environment
cp apps/web/.env.example apps/web/.env

# Generate the app key and run migrations (from the app workspace)
cd apps/web
node ace generate:key
node ace migration:run

# Start the development server (repo root or apps/web)
npm run dev
```

The app is available at `http://localhost:3333` (public site), `/admin` for the back office, and MailHog at `http://localhost:8025`.

> [!NOTE]
> This is a **two-workspace monorepo**: the complete AdonisJS application lives in `apps/web/` (`@foundry/web`), the shared React design system in `packages/design-system/` (`@foundry/design-system`), and the repo root holds the workspaces manifest, the single lockfile, the lint/format configs, CI, Docker and docs. `node ace` commands always run from `apps/web/`; the npm scripts (`dev`, `build`, `test`, `lint`, `format`, `typecheck`, …) run from the repo root and proxy to the workspace.

> [!NOTE]
> This repository uses LF line endings (`oxfmt` enforces `endOfLine: lf` and `.gitattributes` sets `* text=auto`). On Windows, run `git config core.autocrlf false` before your first commit to keep the working tree LF-only and avoid CRLF churn.

### Available scripts

Run from the repo root:

| Script               | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Start the dev server with HMR             |
| `npm run build`      | Build for production                      |
| `npm start`          | Start the production server               |
| `npm test`           | Run backend tests (Japa)                  |
| `npm run test:front` | Run frontend tests (Vitest)               |
| `npm run lint`       | Lint the whole repo (oxlint)              |
| `npm run format`     | Format the whole repo (oxfmt)             |
| `npm run typecheck`  | Type-check app, Inertia and design system |

## Configuration

Copy `apps/web/.env.example` to `apps/web/.env` (the file is the reference — every variable is validated in `apps/web/start/env.ts`):

```env
# Node
TZ=UTC
PORT=3333
HOST=localhost
NODE_ENV=development

# App — the floralia identity
LOG_LEVEL=info
APP_KEY=
APP_URL=http://localhost:3333
APP_NAME=Floralia Atelier

# Session
SESSION_DRIVER=redis

# Auth guards — session (`web`) always on; opt-in opaque-token guard (`api`)
# exposes the token-only REST API under `/api/v1/*`
AUTH_GUARD_WEB=true
AUTH_GUARD_API=false
AUTH_API_TOKEN_EXPIRY=30 days
AUTH_API_CLIENT_URL=

# Database
PG_HOST=127.0.0.1
PG_PORT=5432
PG_USER=user
PG_PASSWORD=password
PG_DB_NAME=app

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_SOCKET=
# Logical database index. Select a distinct value per site sharing one
# Redis instance so their caches/queues don't collide.
REDIS_DB=0

# Queue — `redis` consumes jobs via a worker process (`node ace queue:work`);
# `sync` runs them inline in the calling process (no worker, no Redis).
QUEUE_DRIVER=redis
QUEUE_CONNECTION=local
QUEUE_CONCURRENCY=5
QUEUE_MAX_RETRIES=3
# Scheduled maintenance tasks ("1d", "24h", "30m"; "0" disables)
MAINTENANCE_LOG_PRUNE_SCHEDULE=
MAINTENANCE_BACKUP_RETENTION_SCHEDULE=
# Retention window in days for Log Entry pruning (default 180)
LOG_RETENTION_DAYS=

# Inbound webhooks — shared HMAC-SHA256 signing secret; empty disables the surface
WEBHOOK_SECRET=
WEBHOOK_REPLAY_WINDOW=

# Mail — MAIL_FROM_ADDRESS is also the contact-form recipient
MAIL_MAILER=smtp
MAIL_FROM_NAME=${APP_NAME}
MAIL_FROM_ADDRESS=contact@floralia-atelier.fr

# SMTP
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USERNAME=username
SMTP_PASSWORD=password

# Sentry — one DSN feeds the Node runtime and the browser bundle
SENTRY_DSN=

# OAuth — providers are enabled only when valid credentials are present
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Drive (File Storage) — active disk for CMS uploads (fs, s3, r2)
DRIVE_DISK=fs
MAX_UPLOAD_SIZE=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
S3_BUCKET=
R2_KEY=
R2_SECRET=
R2_BUCKET=
R2_ENDPOINT=
R2_PUBLIC_URL=
BACKUP_R2_BUCKET=

# Backup — pg_dump pipeline (full on Sundays, differential otherwise)
BACKUP_STORAGE_DISK=fs
BACKUP_TIME=02:00
BACKUP_ENCRYPTION_ENABLED=true
BACKUP_RETENTION_DAILY=7
BACKUP_RETENTION_WEEKLY=4
BACKUP_RETENTION_MONTHLY=3
BACKUP_RETENTION_YEARLY=1
BACKUP_MAX_AGE_HOURS=25
BACKUP_MAX_SIZE_MB=500
BACKUP_MIN_FREE_SPACE_GB=5
BACKUP_NOTIFICATION_EMAIL=
BACKUP_NOTIFY_SUCCESS=false
BACKUP_NOTIFY_FAILURE=true
BACKUP_NOTIFY_HEALTH_CHECK=true
BACKUP_EXCLUDED_TABLES=

# Limiter & CMS content policies
LIMITER_STORE=redis
API_RATE_LIMIT_DEFAULT=60
CMS_IFRAME_ALLOWLIST=www.google.com,maps.google.com
CMS_VIDEO_PROVIDERS=youtube,vimeo

# CMS page search (Typesense) — disabled by default
SEARCH_ENABLED=false
TYPESENSE_HOST=127.0.0.1
TYPESENSE_PORT=8108
TYPESENSE_API_KEY=
TYPESENSE_COLLECTION=cms_page_translations
TYPESENSE_SEARCH_LIMIT=20

# Sitemap — comma-separated additions and exclusions
SITEMAP_ADDITIONS=
SITEMAP_EXCLUSIONS=
```

OAuth providers (GitHub, Google, Facebook) are **automatically enabled** when valid credentials are present; providers with empty or `dummy` credentials are silently disabled. Register the `http://localhost:3333/oauth/{provider}/callback` URLs in your provider dashboards.

## Repository layout

```
floralia-atelier/
├── apps/
│   └── web/                # The complete AdonisJS application (see apps/web/README.md)
├── packages/
│   └── design-system/      # Shared React design system (@foundry/design-system)
├── docs/
│   ├── adr/                # Architecture decision records
│   └── agents/             # Agent docs: per-layer conventions
├── .github/workflows/      # CI: lint, format, tests, typecheck, docker publish
├── docker-compose.yml      # Dev infrastructure (PostgreSQL, Redis, MailHog, Typesense)
└── Dockerfile              # Multi-stage production image
```

The `apps/web` workspace is a **per-domain BFF**, split in two trees organized per domain (`account`, `auth`, `cms`, `core`, `file`, `identity`, `log`, `webhook`):

- **`app/{domain}/`** — the transport layer: thin Inertia/JSON controllers, REST resources, middleware, transformers, VineJS validators, and the domain's self-registering `routes.ts`. Addressed through the `#transport/{domain}/...` alias.
- **`src/{domain}/`** — the business layer: actions (use cases), domain entities, models, repositories, read queries, services, typed exceptions. Addressed through the `#{domain}/...` aliases.

Routing is self-registering: `start/routes.ts` is a pure per-domain import list; each domain gates its surfaces on the feature flags in `config/features.ts`. The CMS page-render catch-alls (`/:slug`, `/:locale/:slug`) register last so they never shadow single-segment routes, and the health probes (`/health`, `/health/ready`) sit outside the maintenance middleware.

### Public routes

| Method | Path                       | Route name                  | Serves                                                  |
| ------ | -------------------------- | --------------------------- | ------------------------------------------------------- |
| GET    | `/`                        | `core.home.render`          | The CMS homepage (`is_homepage` page)                   |
| GET    | `/:slug`                   | `cms.page.render`           | Any published CMS Page                                  |
| GET    | `/:locale/:slug`           | `cms.page.localised.render` | A Page in the requested locale                          |
| POST   | `/contact`                 | `cms.contact.execute`       | The contact form (throttled 5/hour)                     |
| GET    | `/sitemap.xml`             | —                           | Generated sitemap                                       |
| GET    | `/robots.txt`              | —                           | Generated robots.txt (blocks `/admin/*`, `/settings/*`) |
| GET    | `/health`, `/health/ready` | —                           | Liveness / readiness probes                             |

The rest of the surface (admin, auth, settings, API) is documented by the code and by [`docs/agents/`](docs/agents/).

## Architecture & conventions

- **Domain-driven layering** — controllers → actions → services/repositories → models; see the per-layer conventions in [`docs/agents/`](docs/agents/) and the [ADR for the CMS module boundary](docs/adr/0001-cms-module-extraction.md).
- **Workspace layout & aliases** — see [`apps/web/README.md`](apps/web/README.md) and `apps/web/AGENTS.md`.
- **Visual identity** — palette, typography, the intro animation and the one-page navigation: [DESIGN.md](DESIGN.md).
- **Domain glossary** — [CONTEXT.md](CONTEXT.md).

## Docker

**Development** — PostgreSQL, Redis, MailHog and Typesense:

```bash
docker compose up -d
```

**Production** — build the multi-stage image (Node runtime plus `postgresql-client` for the backup pipeline):

```bash
docker build -t floralia-atelier .
```

The image serves the production build from `apps/web/build` (`node bin/server.js`, port 3333). Run a queue worker alongside the app to consume the job queues (password-reset mail, scheduled maintenance tasks, webhook deliveries):

```bash
node ace queue:work -q default,auth,maintenance,webhook
```

With `QUEUE_DRIVER=redis` and no worker running, jobs wait in Redis.

## Quality gates

Run before committing (enforced by CI):

```bash
npm run lint        # oxlint
npm run format      # oxfmt
npm run typecheck   # tsc: app + Inertia + design system
npm run test:front  # Vitest (frontend)
npm test            # Japa (backend)
```

The production build (`npm run build` → `node ace build`) also type-checks the test specs; a green test run alone does not prove the code compiles.

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org/), with the description in the commit body rather than the title:

```
type(scope)
short description
Optional body listing what was added, changed, or removed.
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `perf`.

## License

[MIT License](LICENSE).

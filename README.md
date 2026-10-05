# Tien Dat Huynh — Curriculum Vitae

A fast, static, print-ready personal resume for a Frontend Developer. It ships as plain HTML and CSS with a single tiny inline script for theme persistence, and exports cleanly to an A4 PDF straight from the browser.

**Live site:** <https://tiendathuynh.netlify.app>

## Value Proposition

- **One URL, two formats.** The same page works as a responsive website and as a one-click A4 PDF resume.
- **Fast and cheap to host.** Static output with no client framework runtime, no API and no database.
- **Easy to keep current.** Each job, project and open-source item is its own file, so updating the CV is a content edit rather than a code change.

## Features

| Capability | Details |
| --- | --- |
| Single-page resume | Hero, About, Contact, Education, Career Journey, Skills, Personal Projects, Work Projects, Favourite Open Source |
| Print / PDF export | Dedicated A4 layout, page-break control, interactive UI hidden when printing; the Print button forces the light theme first |
| Light / dark theme | Persisted in `localStorage`, follows `prefers-color-scheme`, applied before first paint to avoid a flash |
| Responsive layout | Single column on mobile, two-column grid on `xl` screens |
| SEO | Title, description and Open Graph meta from one config file, plus an auto-generated sitemap |
| Technology badges | Inline SVG icon set (about 70 icons); no icon font and no external icon requests |

## Tech Stack

[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![daisyUI](https://img.shields.io/badge/daisyUI-5-5A0EF8?logo=daisyui&logoColor=white)](https://daisyui.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-24-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-nginx-2496ED?logo=docker&logoColor=white)](./Dockerfile)

- **Framework:** Astro 7 with the MDX and sitemap integrations
- **Styling:** Tailwind CSS v4 (CSS-first config) and daisyUI v5, plus `@tailwindcss/typography`
- **Language:** TypeScript (`astro/tsconfigs/strict`)
- **Tooling:** ESLint 10 (flat config) and Prettier 3 with the Astro and Tailwind plugins; Husky, commitlint and Commitizen for commit conventions
- **Package manager:** Yarn (classic)
- **Hosting:** Netlify, or a Docker image served by nginx

## Prerequisites

- **Node.js** `v24.16.0` (see `.nvmrc`). Use `nvm use` to switch.
- **Yarn** v1 (classic)
- **Docker** (optional, only for the container build)

No environment variables are needed. The site has no secrets and no runtime configuration. Site metadata lives in [`src/config.ts`](./src/config.ts) and the canonical URL in [`astro.config.mjs`](./astro.config.mjs).

## Quickstart

```bash
git clone https://github.com/tiendat77/curriculum-vitae.git
cd curriculum-vitae
nvm use
yarn install --frozen-lockfile
yarn dev            # http://localhost:4321
```

### Scripts

| Command | Purpose |
| --- | --- |
| `yarn dev` / `yarn start` | Start the dev server with hot reload |
| `yarn build` | Production build to `dist/` |
| `yarn preview` | Serve the production build locally |
| `yarn lint` | Run ESLint |
| `yarn commit` | Guided Conventional Commit prompt |

There is no unit test suite. `yarn build` and `yarn lint` are the correctness gates. To check print output, open the page and use *Print → Save as PDF* (or the Print button), then look at light, dark and print views.

### Updating the content

1. Add or edit a file under `src/contents/` (`experiences/`, `projects/`, `favourite-open-source/`).
2. Register new entries in the parent section file (for example `Experience.astro`).
3. Run `yarn build && yarn lint`.

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the structure and [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) for the workflow. AI agents should also read [AGENTS.md](./AGENTS.md).

## Deployment & CI/CD

| Target | How |
| --- | --- |
| **Netlify** (primary) | Connected to the Git repository. Build command `yarn build`, publish directory `dist`. Settings live in the Netlify UI; there is no `netlify.toml`. |
| **Docker** | Multi-stage build: `node:24-alpine` runs `yarn build`, then `nginx:alpine` serves `dist/` using [`nginx.conf`](./nginx.conf). |

```bash
docker build -t cv .
docker run --rm -p 8080:80 cv     # http://localhost:8080
```

There is **no in-repo CI pipeline** (no GitHub Actions workflow). Quality gates run locally: a Husky `commit-msg` hook runs commitlint, and `yarn build` and `yarn lint` are expected to pass before a PR is opened.

## License

See [LICENSE](./LICENSE).

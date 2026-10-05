# AGENTS.md

Operating manual for AI agents working in this repository. Read it fully before changing anything. Where this file conflicts with your defaults, this file wins.

## 1. Project Overview & Core Stack

A **single-page, static, print-friendly personal resume/CV** for Tien Dat Huynh (Frontend Developer), published at <https://tiendathuynh.netlify.app>. There is no backend, no API, no database, no client-side framework runtime, and no automated test suite. Nearly all work is **editing resume content** or **tuning presentation**.

| Concern | Choice | Version (package.json range) |
| --- | --- | --- |
| Framework | Astro (static output, zero client JS except one inline script) | `astro ^7.3.5` |
| Integrations | `@astrojs/mdx ^8.0.2`, `@astrojs/sitemap ^3.7.4`, `@astrojs/markdown-satteri ^0.4.2` | |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` (CSS-first config, **no `tailwind.config.js`**) | `tailwindcss ^4.3.3` |
| UI kit | daisyUI v5 (used as a Tailwind plugin, themes defined manually) | `daisyui ^5.7.47` |
| Typography | `@tailwindcss/typography ^0.5.20`, Nunito via Google Fonts | |
| Language | TypeScript (`astro/tsconfigs/strict`) in `.astro` frontmatter and `src/**/*.ts` | `typescript ^6` |
| Runtime | Node `v24.16.0` (`.nvmrc`); Docker builds on `node:24-alpine` | |
| Package manager | **Yarn classic** (`yarn.lock`, `yarn install --frozen-lockfile` in Docker) | |
| Lint / format | ESLint 10 flat config + `eslint-plugin-astro`; Prettier 3 + `prettier-plugin-astro` + `prettier-plugin-tailwindcss` | |
| Commits | Commitizen + commitlint (conventional) enforced by Husky `commit-msg` hook | |
| Hosting | Netlify (no `netlify.toml`; config lives in the Netlify UI). Alternative: Docker, nginx serving `dist/` | |

### Architectural pattern

**Content-as-components, single page.** `src/pages/index.astro` is the only route and composes section components. Each resume entry (job, project, open-source item) is its own `.astro` file containing hand-written markup. Shared presentation lives in a small set of layout components (`Section`, `Timeline`, `Project`). There is no CMS, content collection, or data layer; content is JSX-like markup, not JSON/Markdown.

## 2. Directory & Module Structure

```
src/
├── pages/index.astro        # The ONLY route. Page grid + section composition + print rules.
├── layouts/Layout.astro     # <html>/<head>/SEO/OG meta, font, theme script, A4 <page> wrapper.
├── config.ts                # `SITE` constants (url, author, title, description). Single source for meta.
├── components/              # Reusable, content-agnostic UI: Section, Timeline, Project, ThemeToggle, PrintButton.
├── contents/                # Section-level content. One file per resume section:
│   │                        #   Hero, About, Contact, Education, Experience, Skills,
│   │                        #   PersonalProjects, WorkProjects, FavouriteOpenSource
│   ├── experiences/         # One file per job (rendered inside Experience.astro via <Timeline>).
│   ├── projects/            # One file per project (rendered inside Personal/WorkProjects.astro via <Project>).
│   └── favourite-open-source/
├── icons/                   # One .astro SVG per technology (e.g. angular.astro, angular-color.astro).
├── styles/
│   ├── index.css            # Imports tailwind.css then markdown.css (imported once, by Layout.astro).
│   ├── tailwind.css         # Tailwind v4 entry: daisyUI themes, @theme tokens, @utility, base/print rules.
│   └── markdown.css         # `.markdown` typography scope applied on <main>.
├── utils/date.helper.ts     # `formatDate()` – the only helper. Used by Timeline.
└── env.d.ts                 # Astro client types reference.
public/                      # Served as-is: avatars, favicon.svg, toggle-theme.js (theme bootstrap, loaded `is:inline`).
```

Other root files: `Dockerfile` + `nginx.conf` (container deploy), `commitlint.config.cjs`, `eslint.config.mjs`, `.prettierrc`, `.editorconfig`, `.husky/commit-msg`. `.idea/`, `dist/`, `.astro/` are git-ignored: never commit them.

### Layer boundaries

```
pages/index.astro
   └─ contents/*            (section-level; may import components/, icons/, utils/)
        └─ contents/experiences|projects|favourite-open-source/*   (entries; import components/ + icons/)
             └─ components/*     (generic; may import utils/ only)
                  └─ utils/*, config.ts
layouts/Layout.astro        (imports config.ts and styles/index.css only)
```

- `components/` must stay **content-agnostic**. No résumé facts (names, dates, employers) in components.
- `contents/` holds **all** résumé facts. No reusable generic UI belongs here.
- Dependencies point **downward only**. A component must never import from `contents/`.
- Import with the `@/` alias (`@/components/Section.astro`) for anything outside the current folder. Existing `./projects/...` relative imports inside `contents/` are acceptable for siblings/children.

### Where new things go

| Task | Do this |
| --- | --- |
| Add a job | Create `src/contents/experiences/<Company>.astro` using `<Timeline from="YYYY-MM-DD" to="">` (empty `to` = "Present"); import and add an `<li>` in `contents/Experience.astro` in reverse-chronological order. Mind the `break-before-page` / `break-before-auto` print classes. |
| Add a project | Create `src/contents/projects/<Prefix>-<Name>.astro` (`Per-` personal, `Bls-`/`Lwl-` work, by employer prefix) using `<Project>`; register it in `PersonalProjects.astro` or `WorkProjects.astro`. |
| Add an open-source item | `src/contents/favourite-open-source/<Name>.astro`; register in `FavouriteOpenSource.astro`. |
| Add a tech icon | `src/icons/<tech>.astro` (plus `<tech>-color.astro` for the colored variant used in Skills). Copy an existing icon's structure; keep SVGs `currentColor` unless it is a `-color` variant. |
| Add a skill | Edit `src/contents/Skills.astro` (uses `-color` icons and `badge badge-lg`). |
| Change site title/description/author/URL | Edit `src/config.ts` **and** `site` in `astro.config.mjs` (they must match; sitemap uses the latter). |
| New helper | `src/utils/<name>.helper.ts`, named exports, fully typed. |
| New page / route | Do not add one without explicit instruction; this is intentionally a one-page site. |

## 3. Coding Standards & Best Practices

### TypeScript
- Config extends `astro/tsconfigs/strict`. Keep strict-mode cleanliness.
- **No `any`.** Use `unknown` + narrowing, or precise types. Do not use `@ts-ignore`/`@ts-expect-error` to silence errors.
- Type every component with an explicit `interface Props` in the frontmatter, then `const { … } = Astro.props;` (see `Project.astro`, `Timeline.astro`). Mark optional props with `?`; keep literal unions where a closed set exists (`type?: 'Personal' | 'Work' | …`).
- Explicit parameter and return types on exported functions (`formatDate(input: string | Date): string`).
- Prefer `const`, immutable data, and pure functions. No mutation of props.
- Use `import type` for type-only imports.

### Astro
- Default to **zero client-side JS**. Do not add `client:*` directives, UI frameworks (React/Vue/Svelte/Angular), or new `<script>` tags without explicit approval. The only client script is `public/toggle-theme.js` (theme persistence + `prefers-color-scheme`), loaded `is:inline` in `<head>` to avoid a theme flash. Preserve that ordering.
- Frontmatter (`---`) holds imports, Props, and logic; the template stays declarative.
- Use `<slot />` for composition. Do not duplicate wrapper markup that `Section`, `Timeline`, or `Project` already provide.
- External links: `target="_blank"` as the existing code does; when touching/adding such links add `rel="noopener noreferrer"`.
- Images in `public/` are referenced by absolute path (`/avatar_2026.jpg`); always supply meaningful `alt`.
- Keep `compressHTML: true` and the sitemap/MDX integrations intact.

### Tailwind v4 + daisyUI v5
- **CSS-first configuration.** Tokens live in `src/styles/tailwind.css` under `@theme`, `@plugin "daisyui/theme"`, `@utility`, `@layer`. Do **not** create `tailwind.config.js` or use v3 directives (`@tailwind base;`, `theme()`-in-JS config, `@apply` with `!important` suffix syntax).
- Important modifier uses the **v4 trailing syntax**: `print:bg-transparent!`, `print:grid-cols-1!` (not `!print:…`).
- Use semantic daisyUI/theme tokens (`bg-base-100`, `text-primary`, `text-neutral`, `badge badge-primary`) rather than hard-coded hex colors, so light and dark themes keep working. Dark variant is `data-theme="dark"` via the custom `dark` variant, not the `.dark` class.
- Every visual change must be checked for **print** (A4 portrait). Use `print:` variants; hide interactive UI with `print:hidden`/`print:hidden!`; control pagination with `break-before-*`, `page-break-*`.
- Prefer utility classes inline. New custom CSS is a last resort and goes in `tailwind.css` (see Don'ts regarding global styles).
- Class ordering is handled by `prettier-plugin-tailwindcss`; don't hand-sort.

### Formatting & style
- Prettier (`.prettierrc`): 2 spaces, `singleQuote: true`, `printWidth: 100`. `.editorconfig`: UTF-8, LF-ish, final newline, trim trailing whitespace (except `.md`).
- **Known inconsistency:** the existing codebase mixes `"double"` and `'single'` quotes. Follow the Prettier config for **new/edited** lines; do not reformat unrelated lines or whole files just to fix quotes.
- Do not run `prettier --write` across the repo. Format only files you touch, and keep diffs minimal.

### Naming conventions
| Thing | Convention | Example |
| --- | --- | --- |
| Components / content files | `PascalCase.astro` | `Timeline.astro`, `PersonalProjects.astro` |
| Experience files | `Company-Name.astro` | `Leanwell-Tech.astro`, `Fpt-Software.astro` |
| Project files | `<Prefix>-<PascalName>.astro` | `Per-Gomoku.astro`, `Bls-Booking.astro` |
| Icon files | `kebab-case.astro`, `-color` suffix for colored variant | `docker-color.astro` |
| Helpers | `<name>.helper.ts` | `date.helper.ts` |
| TS identifiers | `camelCase` vars/functions, `PascalCase` types/interfaces, `UPPER_CASE` constants objects (`SITE`) | |
| Imported component bindings | `PascalCase`; icons suffixed `Icon` | `import AngularIcon from "@/icons/angular.astro"` |
| Commit messages | Conventional Commits (see §4) | |

> **Case-sensitivity trap:** `src/contents/projects/` contains `Per-LaSoTuVi.astro`, `Per-Lasotuvi.astro`, and `per-lasotuvi.astro`, which differ only by case. Only `Per-LaSoTuVi.astro` is imported. Linux/Docker builds are case-sensitive; macOS/Windows are not. Never create files whose names differ only by case, always match import casing exactly, and do not delete the extra variants without confirming with the user (recent commit `93f3bc8` was a case-sensitivity fix).

## 4. Essential Commands

Use **yarn** (not npm/pnpm) so `yarn.lock` stays authoritative. Use Node 24 (`nvm use`).

```bash
yarn install --frozen-lockfile   # install exactly what yarn.lock specifies
yarn dev                         # dev server (alias: yarn start) → http://localhost:4321
yarn build                       # production build → dist/ (also the main correctness gate)
yarn preview                     # serve the built dist/ locally
yarn lint                        # eslint . (flat config, astro plugin)
yarn commit                      # interactive Commitizen prompt (git-cz + commitlint rules)
```

**Typechecking:** there is no `typecheck` script and `@astrojs/check` is **not installed**. Treat `yarn build` + `yarn lint` as the verification gate. If a stricter check is required, ask before adding `@astrojs/check` as a devDependency; do not add it silently.

**Tests:** none exist. Do not invent or claim test results. Verification is `yarn build` succeeding, `yarn lint` clean, and (for visual changes) a look at `yarn dev`/`yarn preview` in light, dark, and print preview.

**Docker (production image):**
```bash
docker build -t cv .
docker run --rm -p 8080:80 cv    # nginx serves dist/ on :80
```
The Dockerfile copies only `package.json`, `yarn.lock`, `src/`, `public/`, `astro.config.mjs`, `tsconfig.json`. If you add a new root-level file the build depends on, update the Dockerfile too. `nginx.conf` strips `.html` and trailing slashes (301) and serves `/404.html` / `/500.html`.

**CI/CD:** no GitHub Actions or `netlify.toml` in the repo; deploys are handled by Netlify. Do not add CI config unless asked.

**Git hooks / commits:** Husky runs `commitlint` on `commit-msg`. Messages must be Conventional Commits with an allowed type: `build, chore, ci, docs, feat, fix, wip, perf, refactor, revert, style, test, init`. The repo's history uses a gitmoji after the type, e.g. `feat: ✨ add Javascript skill`, `fix: 🐛 case sensitive`, `refactor: ♻️ migrate packages…`. Keep the subject short and imperative. Never use `--no-verify`.

## 5. Agent Operational Constraints

### DO
- **Verify before delivering.** Run `yarn build` and `yarn lint` and report their real output. If you cannot run them, say so explicitly.
- **Read before editing.** Open the sibling file (e.g. another `experiences/*.astro`) and copy its structure, class names, and badge markup exactly.
- **Keep content factual.** Résumé content is the owner's personal history. Only edit employers, dates, titles, metrics, skills, and contact details when the user supplies the facts. Never fabricate achievements, technologies, or dates.
- **Preserve print/A4 behavior** (`print:` classes, `break-before-*`, `page[size="A4"]` rules, hidden toolbars) and dark/light theming on every UI change.
- **Preserve performance characteristics:** static output, no hydration, `compressHTML`, `is:inline` theme script in `<head>`, `preconnect` + `display=swap` for fonts, small inline SVG icons (no icon font or heavy icon library).
- **Maintain separation of concerns:** facts in `contents/`, presentation in `components/`, tokens/theme in `styles/tailwind.css`, site metadata in `config.ts`.
- **Keep SEO/meta intact:** `Layout.astro` props default to `SITE`; keep `<title>`, description, OG tags, and `site` in `astro.config.mjs` consistent.
- **Keep diffs small and scoped** to what was requested. Mention unrelated problems you notice instead of fixing them.
- **Match existing patterns** (`type="Personal"` badge, `year`, `<article class="mt-2 text-sm">`, `<ul class="flex flex-wrap gap-2 mt-2">` badge lists).
- **Update docs** (`README.md`, this file) when you change commands, structure, or conventions.

### DO NOT
- **Do not modify global styles casually.** `src/styles/tailwind.css` (theme tokens, `@layer base`, print rules) and `markdown.css` affect the entire page and print layout. Change them only when the task is explicitly about theming/typography/print, keep edits minimal, and verify light, dark, and print. Prefer local utility classes.
- **Do not add runtime dependencies** or swap tooling (npm/pnpm, Vite plugins, UI frameworks, Tailwind v3, a config JS file) without explicit approval. Never edit `yarn.lock` by hand.
- **Do not bypass the existing components.** Don't hand-roll timeline/project/section markup when `Timeline`, `Project`, or `Section` exists.
- **Do not invent a backend/API layer, content collections, i18n, routing, or client-side state** for this site; none is needed.
- **Do not use deprecated/legacy patterns:** Tailwind v3 syntax (`@tailwind`, leading `!` important, `tailwind.config.js`, `dark:` via class strategy), daisyUI v4 theme config, Astro v2-era APIs (`Astro.glob`, old `ViewTransitions`), `var`, `any`, `require()` in source.
- **Do not hard-code colors** that bypass theme tokens, and do not break dark mode.
- **Do not create files that differ only by case**, or change an import's casing without matching the file on disk.
- **Do not commit** `dist/`, `.astro/`, `.idea/`, `node_modules/`, secrets, or large unoptimized images (put assets in `public/`, keep them reasonably sized).
- **Do not commit, push, or open PRs unless asked**, and never skip hooks or force-push.
- **Do not reformat unrelated code** or mass-rename files.
- **Do not leak personal data** beyond what is already in the site (name, email, and phone in `config.ts`/`Contact.astro`). Don't add addresses, IDs, or credentials.

## 6. Error Handling & State Management

This is a static site; the concepts apply narrowly.

**State management**
- There is **no application state**, store, or framework reactivity. Do not introduce one.
- The sole client-side state is the **theme**: `localStorage["theme"]` (`"light" | "dark"`) mirrored to `<html data-theme>`, managed exclusively by `public/toggle-theme.js` and the `#theme-btn` checkbox in `ThemeToggle.astro`. Falls back to `prefers-color-scheme`. Don't duplicate this logic elsewhere, and keep the element id `theme-btn` stable.
- Data flows one way at build time: `config.ts` / frontmatter props → templates → static HTML.

**API responses / services**
- There are **no API calls, services, or response wrappers**. Don't add `fetch` calls or runtime data loading. If a feature ever needs external data, fetch it at build time in frontmatter and ask the user first.

**Error handling**
- **Build-time:** a failing `yarn build` is the error signal. Fix the cause (broken import, bad casing, type error in frontmatter); never suppress it.
- **Helpers:** follow `formatDate`: handle empty input (`''` → `'Present'`) and invalid input with a deterministic, user-safe fallback string rather than throwing during render. Validate inputs at the boundary, keep functions pure.
- **Props:** required props typed in `interface Props`; optional ones guarded with `{value && (...)}` as in `Project.astro`.
- **Runtime/server:** `nginx.conf` serves `/404.html` and `/500.html`. Netlify handles 404s in its own hosting. Don't add client-side error-reporting code.
- Don't swallow errors with empty `catch` blocks; don't `console.log` debug output into committed code.

## 7. Pre-delivery Checklist

- [ ] `yarn build` succeeds; `yarn lint` is clean (or pre-existing failures are noted).
- [ ] Only requested files changed; no stray formatting churn.
- [ ] New content mirrors existing structure; registered in its parent section file.
- [ ] Light, dark, and print (A4) appearance verified for visual changes.
- [ ] Import paths and file-name casing match exactly.
- [ ] No new dependencies, client JS, or global style changes (or they were explicitly approved).
- [ ] Commit message (if asked to commit) follows Conventional Commits + gitmoji style.

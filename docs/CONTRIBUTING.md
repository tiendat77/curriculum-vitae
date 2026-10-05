# Contributing

Thanks for helping improve this project. It is a small static resume site, so the process is deliberately lightweight. Please read [AGENTS.md](../AGENTS.md) (also useful for humans) and [ARCHITECTURE.md](./ARCHITECTURE.md) first.

## Getting set up

```bash
nvm use                          # Node v24.16.0 (.nvmrc)
yarn install --frozen-lockfile
yarn dev                         # http://localhost:4321
```

## Branching Strategy

The default branch is `main` and it is always deployable. Netlify publishes it.

| Branch | Purpose |
| --- | --- |
| `main` | Production. Do not commit directly; merge through a pull request. |
| `<type>/<short-description>` | Short-lived working branches, branched from `main` |
| `v2022` | Legacy snapshot of the previous version. Do not modify. |

Branch name prefixes mirror commit types: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`, `style/`, `perf/`, `build/`, `ci/`. Examples: `feat/add-react-skill`, `fix/print-page-break`, `refactor/migrate`.

Rebase onto `main` before opening a PR. Keep branches small and short-lived, and prefer one concern per branch.

## Commit Conventions

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are enforced by commitlint through a Husky `commit-msg` hook. Never bypass it with `--no-verify`.

```
<type>(<optional scope>): <gitmoji> <imperative subject>
```

Allowed types:

| Type | Emoji | Use for |
| --- | --- | --- |
| `feat` | ✨ | New content, section or capability |
| `fix` | 🐛 | Bug fix (layout, print, casing, etc.) |
| `docs` | 📚 | Documentation only |
| `style` | 💄 | Formatting only, no meaning change |
| `refactor` | 📦 / ♻️ | Restructure with no behavior change |
| `perf` | 🚀 | Performance improvement |
| `test` | 🚨 | Tests |
| `build` | 🏷️ | Build system or dependencies |
| `ci` | ⚙️ | CI configuration |
| `chore` | ♻️ | Maintenance with no src impact |
| `revert` | 🗑 | Revert a previous commit |
| `wip` | 🚧 | Work in progress (do not merge as-is) |
| `init` | 🎉 | Project initialization |

Use the guided prompt to get it right:

```bash
git add <files>
yarn commit
```

Examples from this repo's history: `feat: ✨ add Javascript skill and update experience at Leanwell Technology`, `fix: 🐛 case sensitive`, `refactor: ♻️ migrate packages to latest version`.

Guidelines:

- Subject is imperative, short and has no trailing period.
- Explain the *why* in the body when it isn't obvious.
- Mark breaking changes with `!` or a `BREAKING CHANGE:` footer.
- One logical change per commit.

## Development Workflow

1. Create a branch from an up-to-date `main`.
2. Make a focused change, following the structure rules in [AGENTS.md](../AGENTS.md):
   - Résumé facts go in `src/contents/**`
   - Reusable UI goes in `src/components/**`
   - Theme and tokens go in `src/styles/tailwind.css`, and only for theming tasks
   - New entries must be registered in their parent section file
3. Run the checks (below).
4. Commit with `yarn commit` and push.
5. Open a pull request against `main`.

## Testing Expectations

There is **no automated test suite**, and none should be claimed. Verification is:

| Check | Command or action | Required |
| --- | --- | --- |
| Lint | `yarn lint` | Yes. Must be clean, or any pre-existing failures noted in the PR. |
| Build | `yarn build` | Yes. Must succeed; it is the main correctness gate. |
| Visual: light and dark | `yarn dev`, toggle the theme | Yes, for any UI change |
| Visual: responsive | Mobile width and `xl` desktop | Yes, for any layout change |
| Visual: print | Print Preview (A4 portrait) or the Print button | Yes. Page breaks, hidden controls and no clipped content. |
| Production parity | `yarn preview` (and `docker build` if you touched Docker/nginx) | When relevant |

If you add logic beyond trivial helpers, discuss adding a test runner (for example Vitest) in the PR before introducing it.

## Pull Request Process

Open the PR against `main`. Use a Conventional Commit–style title. Include:

- **What and why**: a short summary, linking any issue
- **Screenshots**: before and after for visual changes, including dark mode and a print preview
- **Verification**: confirmation that `yarn build` and `yarn lint` passed
- **Risks**: anything touching global styles, dependencies, Docker or nginx

Prefer **squash merge** with a Conventional Commit title so `main` stays readable.

### Review Criteria

Reviewers check that the PR is:

- [ ] **Scoped.** It does what the title says, with no unrelated reformatting or renames.
- [ ] **Correct.** The build and lint pass, and links, dates and spellings are right.
- [ ] **Accurate.** Résumé facts (employers, titles, dates, metrics) are true and supplied by the owner.
- [ ] **Structurally sound.** Content is in `contents/`, generic UI is in `components/`, dependencies point downward only, and new entries are registered in the parent file.
- [ ] **Pattern-consistent.** It reuses `Section`, `Timeline` and `Project`, matches sibling markup and badge style, and uses the `@/` alias.
- [ ] **Typed.** `interface Props` is present, there is no `any` and no suppressed errors.
- [ ] **Style-compliant.** It uses Tailwind v4 and daisyUI v5 syntax (trailing `!` for important), semantic theme tokens and no hard-coded colors.
- [ ] **Safe for dark and print.** Light, dark and A4 print all look right.
- [ ] **Performance-preserving.** There is no client JS, hydration, heavy dependency or large unoptimized asset. The inline theme script is untouched.
- [ ] **Free of global-style changes** unless explicitly justified, and verified across themes and print.
- [ ] **Clean on casing.** There are no filenames that differ only by case, and import casing matches the file on disk.
- [ ] **Clean on hygiene.** There are no committed build artifacts (`dist/`, `.astro/`, `.idea/`), no secrets, no hand-edited `yarn.lock`, and the commits follow Conventional Commits.
- [ ] **Documented.** README, ARCHITECTURE or AGENTS are updated if commands, structure or conventions changed.

## Dependency Changes

- Use `yarn add` / `yarn add -D` so `yarn.lock` updates. Never edit it by hand.
- Justify any new runtime dependency in the PR. This site should stay near-zero runtime JS.
- Run `yarn build` and `yarn lint` after major bumps (Astro, Tailwind, daisyUI), and check print output, since these tools have had breaking changes.

## Code Style Quick Reference

- Prettier: 2 spaces, single quotes, 100-column width. Format only the files you touch.
- Components and content files are `PascalCase.astro`. Project files use `<Prefix>-<Name>.astro`. Helpers are `<name>.helper.ts`.
- External links use `target="_blank" rel="noopener noreferrer"`.
- Keep `alt` text on images.

## Reporting Issues

Include the page or section affected, the browser and OS, the theme (light or dark), whether it happens in print, and a screenshot where possible.

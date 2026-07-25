# Update Workflow

Use this checklist for every feature, page, or UI update. The goal is to keep the codebase easy to extend and avoid rebuilding existing components.

## Before Building

1. Read `AGENTS.md` for project rules.
2. For UI work, read `docs/RTL_ARCHITECTURE.md` before changing layout,
   ordering, responsive behavior, or mixed-direction content.
3. Read `PROJECT_MAP.md` to understand routes, data sources, assets, and shell behavior.
4. Read `COMPONENTS.md` before creating any new component.
5. Search the codebase with `rg` for similar UI, data, or behavior.
6. For Next.js-specific changes, read the relevant guide under `node_modules/next/dist/docs/`.

## Reuse Rules

- Reuse `SiteShell`, `Header`, and `Footer` for public page framing.
- Reuse `ProductCard` for product grids, carousels, and wishlist views.
- Reuse `SchoolPromo` for the school-supplies promo banner.
- Reuse `SectionButton` for orange section CTA links.
- Keep page-specific UI inline until a second page needs it.
- Extract a shared component when the same structure appears in two or more places.

## Data Rules

- This project is UI-only until backend endpoints are ready.
- Use `lib/mock-data.ts` for page data.
- Keep shared shapes in `types/`.
- If backend fields differ later, add mapper functions instead of passing raw API responses into components.
- Do not add real API calls unless the backend contract is explicitly part of the task.

## Visual Rules

- Keep `<html lang="ar" dir="rtl">`.
- Build RTL layouts first.
- Use Amiri through `font-heading` and Cairo through `font-body`.
- Use Tailwind tokens and CSS variables instead of hardcoded design values where a token already exists.
- Use `next/image` for local images.
- Screenshot-check pages when matching a supplied reference.

## Documentation Rules

Update docs in the same change when behavior changes:

- Add or update `COMPONENTS.md` when adding, removing, renaming, or broadening a component.
- Add or update `PROJECT_MAP.md` when adding routes, assets, data modules, or global shell behavior.
- Add or update `docs/RTL_ARCHITECTURE.md` when the project-wide RTL,
  responsive, BiDi, or semantic-order contract changes.
- Add or update `BACKEND_INTEGRATION.md` when backend assumptions or API contracts change.
- Add or update this file when the implementation process changes.

## Verification

Run these before finalizing implementation:

```powershell
npm.cmd run lint
npm.cmd run build
```

For visual work, also run the app locally and inspect the changed route at desktop and mobile widths. Use Playwright screenshots when available.

## Commit Rules

- Check the worktree first with `git status --short`.
- Do not use `git add .` in a dirty worktree.
- Stage only files related to the current task.
- Review staged files with `git diff --cached --stat`.
- Use focused commit messages, for example:
  - `docs: add project map and update workflow`
  - `feat: add products listing page`
  - `refactor: reuse school promo banner`
- Do not commit unrelated user changes.

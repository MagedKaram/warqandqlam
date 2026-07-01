# Warqa w Qalam Frontend

Arabic-first RTL storefront prototype built with Next.js 16 App Router, React 19, TypeScript strict mode, and Tailwind CSS v4.

## Quick Start

```powershell
npm.cmd run dev
```

Open `http://localhost:3000`.

## Project Docs

- `AGENTS.md` - stack rules, Arabic/RTL requirements, frontend-only status, and Figma workflow.
- `PROJECT_MAP.md` - routes, source layout, data sources, assets, and global shell map.
- `COMPONENTS.md` - component inventory and reuse guidance.
- `UPDATE_WORKFLOW.md` - required checklist for future feature updates and commits.
- `BACKEND_INTEGRATION.md` - planned backend integration path and API contract notes.

## Commands

```powershell
npm.cmd run lint
npm.cmd run build
```

## Current Status

The app is UI-only. Use mock data from `lib/mock-data.ts` until backend endpoints are finalized.

Keep `<html lang="ar" dir="rtl">`, use configured font tokens, and check existing components before creating new ones.

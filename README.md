# Warq & Qalam

Arabic-only storefront prototype built with Next.js 16 App Router, React 19, TypeScript strict mode, and Tailwind CSS v4.

## Overview

This repo contains the UI for browsing products, categories, cart, checkout, auth, FAQ, printing services, and order result flows. The current implementation is frontend-only and uses mock data from `lib/mock-data.ts` until the backend is ready.

## Tech Stack

- Next.js 16
- React 19
- TypeScript with `strict` enabled
- Tailwind CSS v4
- Arabic RTL layout with configured font tokens

## Getting Started

```powershell
npm install
npm run dev
```

Open `http://localhost:3000` after the dev server starts.

## Available Scripts

```powershell
npm run lint
npm run build
npm run start
```

## Project Structure

- `app/` - routes and page-level composition.
- `components/` - reusable UI blocks and feature sections.
- `lib/` - mock data and shared helpers.
- `types/` - shared TypeScript types.
- `public/` - static assets.

## Notes

- Keep `<html lang="ar" dir="rtl">` in the root layout.
- Local docs and screenshot references are intentionally excluded from version control.

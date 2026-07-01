# Project Map

This project is an Arabic-first, RTL, frontend-only storefront for Warqa w Qalam. It uses Next.js 16 App Router, React 19, TypeScript strict mode, and Tailwind CSS v4.

## Source Layout

| Path | Purpose |
| --- | --- |
| `app/` | App Router routes, page metadata, and route-level compositions. |
| `components/` | Reusable UI components grouped by domain: auth, home, layout, product, signup, and base UI. |
| `lib/` | Mock data and validation helpers. Keep UI data normalization here until backend APIs exist. |
| `types/` | Shared TypeScript types used across route and component boundaries. |
| `public/assets/images/` | Local image assets used by pages and components. |
| `screen/` | Reference screenshots supplied for visual matching. |

## Routes

| Route | File | Status | Notes |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | UI prototype | Home page composed from home section components. |
| `/categories` | `app/categories/page.tsx` | UI prototype | Category listing using mock category data. |
| `/products` | `app/products/page.tsx` | UI prototype | Product listing, promo banner, filter drawer, and pagination using mock data. |
| `/wishlist` | `app/wishlist/page.tsx` and `app/wishlist/WishlistContent.tsx` | UI prototype | Local wishlist state only; no persistence yet. |
| `/signup` | `app/signup/page.tsx` | UI prototype | Uses shared auth layout and signup form. |
| `/login` | `app/login/page.tsx` | UI prototype | Visual auth page only. |
| `/forgot-password` | `app/forgot-password/page.tsx` | UI prototype | Visual auth recovery page only. |
| `/verify-code` | `app/verify-code/page.tsx` | UI prototype | Visual code verification page only. |
| `/reset-password` | `app/reset-password/page.tsx` | UI prototype | Visual reset page and modal only. |

Header links may point to future routes such as `/printing`, `/contact`, `/about`, `/cart`, and product detail routes. Those routes are not fully implemented yet unless corresponding files are added under `app/`.

## Global Shell

- `app/layout.tsx` owns `<html lang="ar" dir="rtl">`, font variables, and global metadata.
- `components/layout/SiteShell.tsx` wraps public pages with `Header`, `Footer`, and `RoutePreloader`.
- Auth routes are excluded from the public header/footer in `SiteShell`.
- Do not recreate the header or footer inside pages.

## Data Sources

- The app is frontend-only for now.
- Use `lib/mock-data.ts` for products, categories, FAQ, testimonials, company logos, and wishlist mock content.
- Keep UI components on normalized frontend types, especially `types/product.ts`.
- Do not add real backend calls until backend endpoints are confirmed.
- Backend planning lives in `BACKEND_INTEGRATION.md`.

## Assets

| Folder | Purpose |
| --- | --- |
| `public/assets/images/logo.png` | Brand/logo image. |
| `public/assets/images/auth-art.png` | Auth layout artwork. |
| `public/assets/images/home/` | Home page and category section images. |
| `public/assets/images/home/company/` | Company/partner logo strip images. |
| `public/assets/images/home/products/` | Product images originally used in home best sellers. |
| `public/assets/images/products/` | Products page listing images and promo banner asset. |

Use `next/image` for local assets. Prefer existing assets before adding new ones.

## Styling Rules

- Arabic and RTL are default.
- Headings use `font-heading`; body text uses `font-body`.
- Do not hardcode `font-family`.
- Use Tailwind tokens and CSS variables from `tailwind.config.ts` and `app/globals.css`.
- Keep shared visual patterns in components before adding one-off markup.

## Documentation Sources

- `AGENTS.md` - stack, RTL, frontend-only, and Figma rules.
- `COMPONENTS.md` - reusable component inventory and reuse guidance.
- `UPDATE_WORKFLOW.md` - required implementation workflow for future changes.
- `BACKEND_INTEGRATION.md` - planned backend API integration path.

# Project Map

This project is an Arabic-only, RTL, frontend-only storefront for Warqa w Qalam. It uses Next.js 16 App Router, React 19, TypeScript strict mode, and Tailwind CSS v4.

## Source Layout

| Path | Purpose |
| --- | --- |
| `app/` | App Router routes, page metadata, and route-level compositions. |
| `components/` | Reusable UI components grouped by domain, including cart, checkout, orders, printing, product, layout, auth, and home UI. |
| `lib/` | Mock data plus versioned cart/checkout storage, calculations, configuration, and state helpers. |
| `types/` | Shared TypeScript types used across route and component boundaries. |
| `public/assets/images/` | Local image assets used by pages and components. |
| `screen/` | Reference screenshots supplied for visual matching. |

## Routes

| Route | File | Status | Notes |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | UI prototype | Home page composed from home section components. |
| `/categories` | `app/categories/page.tsx` | UI prototype | Category listing using mock category data. |
| `/categories/[slug]` | `app/categories/[slug]/page.tsx` | UI placeholder | Category landing route using mock category data; product grids are not category-filtered yet. |
| `/products` | `app/products/page.tsx` | UI prototype | Product listing, promo banner, filter drawer, and pagination using mock data. |
| `/products/[slug]` | `app/products/[slug]/page.tsx` | UI prototype | Product details page with gallery, purchase controls, tabs, related products, and delivery promo using mock data. |
| `/wishlist` | `app/wishlist/page.tsx` and `app/wishlist/WishlistContent.tsx` | UI prototype | Local wishlist state only; no persistence yet. |
| `/cart` | `app/cart/page.tsx` | UI prototype | Persistent product/printing cart, coupon, shipping, totals, quantity, related products, and checkout navigation. |
| `/checkout` | `app/checkout/page.tsx` | UI prototype | Delivery form, typed payment selection, shared summary/review/processing, explicit method switching with focus restoration, safe retry, and frontend-only COD, Vodafone Cash, Instapay, and Bank Card flows. |
| `/order/success` | `app/order/success/page.tsx` | UI prototype | Frontend prototype order-success result. |
| `/order/failed` | `app/order/failed/page.tsx` | UI prototype | Safe failure preview with same-method retry and change-payment navigation; both preserve the cart. |
| `/printing` | `app/printing/page.tsx` | UI prototype | Transient file selection and print configuration that persists metadata-only printing items to the unified cart. |
| `/about` | `app/about/page.tsx` | UI placeholder | Brand information placeholder until final copy is available. |
| `/contact` | `app/contact/page.tsx` | UI placeholder | Contact information placeholder until final contact data is available. |
| `/signup` | `app/signup/page.tsx` | UI prototype | Uses shared auth layout and signup form. |
| `/login` | `app/login/page.tsx` | UI prototype | Visual auth page only. |
| `/forgot-password` | `app/forgot-password/page.tsx` | UI prototype | Visual auth recovery page only. |
| `/verify-code` | `app/verify-code/page.tsx` | UI prototype | Visual code verification page only. |
| `/reset-password` | `app/reset-password/page.tsx` | UI prototype | Visual reset page and modal only. |

Cash on Delivery, Vodafone Cash, Instapay, and Bank Card are implemented as
frontend prototypes. No route performs a real provider transaction; Bank Card
persists only safe brand/last-four metadata.

## Global Shell

- `app/layout.tsx` owns `<html lang="ar" dir="rtl">`, font variables, and global metadata.
- `components/layout/SiteShell.tsx` wraps the application in `CartProvider` and frames public pages with `Header`, `Footer`, and `RoutePreloader`.
- Auth routes are excluded from the public header/footer in `SiteShell`.
- Do not recreate the header or footer inside pages.

## Data Sources

- The app is frontend-only for now.
- Use `lib/mock-data.ts` for products, categories, FAQ, testimonials, company logos, and wishlist mock content.
- `lib/cart/` owns cart configuration, calculations, safe versioned storage, legacy printing-order migration, and the typed product-card-to-cart adapter.
- `lib/checkout/` owns saved-delivery/latest-order storage, payment registration, checkout transitions, payment-specific validation, safe per-tab drafts and failure retry context, and frontend prototype order creation.
- Active `localStorage` keys are `warqandqlam.cart`, `warqandqlam.checkout.saved-delivery.v1`, and `warqandqlam.checkout.latest-order.v1`.
- Active `sessionStorage` keys are `warqandqlam.checkout.instapay-draft.v1`, `warqandqlam.checkout.bank-card-draft.v1`, and `warqandqlam.checkout.retry-context.v1`. Retry context contains delivery, the selected method, and safe transfer metadata only; Bank Card drafts/retry context never contain PAN, expiry, or CVV.
- Printing cart items persist file metadata only. Raw files and object URLs remain transient in the printing page.
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
| `public/assets/images/productdetails/` | Product detail gallery, related product images, and delivery promo artwork. |
| `verification/cart-checkout/` | Required desktop/mobile screenshots for Cart, Checkout, Success, and Failure verification states. |
| `verification/vodafone-cash/` | Desktop flow-step, mobile, success, and safe failure-route screenshots for Vodafone Cash verification. |
| `verification/instapay/` | Shared checkout, details, review, processing, result, mobile, and regression screenshots for Instapay. |
| `verification/bank-card/` | Bank Card selection, details, validation, review, processing, result, mobile, and payment-regression screenshots. |
| `verification/shared-components/` | Before/after, mobile, and keyboard-focus evidence for shared Product Card and Quantity Stepper consolidation. |

Use `next/image` for local assets. Prefer existing assets before adding new ones.

## Styling Rules

- Arabic and RTL are default.
- Headings use `font-heading`; body text uses `font-body`.
- Do not hardcode `font-family`.
- Use Tailwind tokens and CSS variables from `tailwind.config.ts` and `app/globals.css`.
- Keep shared visual patterns in components before adding one-off markup.

## Documentation Sources

- `AGENTS.md` - stack, RTL, frontend-only, and Figma rules.
- `docs/RTL_ARCHITECTURE.md` - mandatory RTL, BiDi, semantic DOM, responsive, and verification patterns.
- `COMPONENTS.md` - reusable component inventory and reuse guidance.
- `UPDATE_WORKFLOW.md` - required implementation workflow for future changes.
- `BACKEND_INTEGRATION.md` - planned backend API integration path.

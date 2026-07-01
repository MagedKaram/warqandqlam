# Component Inventory

This file documents the current UI components so new pages reuse existing building blocks before creating new ones. The app is Arabic-first and RTL by default; keep using the configured Tailwind font tokens and CSS variables.

## Layout

| Component | Path | Role | Used by | Reuse notes |
| --- | --- | --- | --- | --- |
| `SiteShell` | `components/layout/SiteShell.tsx` | Wraps public pages with route preloader, header, and footer while hiding them on auth routes. | `app/layout.tsx` | Use for global shell behavior only. Add route-level exceptions here if needed. |
| `Header` | `components/layout/Header/Header.tsx` | Public nav, promo bar, search popover, mobile drawer, account/cart/wishlist actions. | `SiteShell` | Do not duplicate nav/action bars in pages. Extend this component for global header changes. |
| `Footer` | `components/layout/Footer.tsx` | Public footer with brand copy, links, and social icons. | `SiteShell` | Do not create page-specific footers unless the route is intentionally outside the public shell. |
| `RoutePreloader` | `components/layout/RoutePreloader.tsx` | Route transition loading overlay. | `SiteShell` | Shared global behavior. |

## Product And Commerce

| Component | Path | Role | Used by | Reuse notes |
| --- | --- | --- | --- | --- |
| `ProductCard` | `components/product/ProductCard.tsx` | Shared product tile with image, new badge, wishlist action, title, and price. | `BestSellers`, `WishlistContent`, `/products` | Use for every product grid/carousel before creating another card. Add props here if product tiles need a controlled visual variant. |
| `ProductsFilterControls` | `components/product/ProductsFilterControls.tsx` | Products-page sort control and RTL filter drawer. | `/products` | Page-specific for now. If category pages need filters, promote this to a generic catalog filter component. |
| `ProductDetailsView` | `components/product/ProductDetailsView.tsx` | Product detail composition: gallery, purchase controls, service strip, tabs, related products, and delivery promo. | `/products/[slug]` | Detail-page shell. Keep the route as a Server Component and put browser interactions here. |
| `SchoolPromo` | `components/home/SchoolPromo.tsx` | Reusable school-supplies promo banner with discount pill, title, CTA, and image. | Home page, `/products` | Shared by home and products. Use props for `headingLevel`, `ctaHref`, image source, and image dimensions instead of rebuilding the banner. |
| `SectionButton` | `components/home/SectionButton.tsx` | Orange CTA link with optional icon. | `PrintServices`, `SchoolPromo` | Use for section CTA links that match the orange button style. |

## Home Sections

| Component | Path | Role | Used by | Reuse notes |
| --- | --- | --- | --- | --- |
| `HeroSlider` | `components/home/HeroSlider.tsx` | Home hero carousel. | Home page | Home-specific. Extract slide/card primitives only if another page needs the same carousel behavior. |
| `PrintServices` | `components/home/PrintServices.tsx` | Printing-service promo section. | Home page | Home-specific section; reuses `SectionButton`. |
| `Categories` | `components/home/Categories.tsx` | Home category preview section. | Home page | Use category mock data from `lib/mock-data.ts`; do not duplicate category cards casually. |
| `BestSellers` | `components/home/BestSellers.tsx` | Horizontal best-seller product carousel. | Home page | Already reuses `ProductCard`. If another carousel is needed, consider extracting a generic product carousel. |
| `Testimonials` | `components/home/Testimonials.tsx` | Customer testimonial section. | Home page | Home-specific until another route needs reviews. |
| `CompanyLogos` | `components/home/CompanyLogos.tsx` | Partner/company logo strip. | Home page | Home-specific unless a brand strip is needed elsewhere. |
| `Faq` | `components/home/Faq.tsx` | FAQ accordion/list section. | Home page | If moved to another page, reuse this component and pass data as props. |
| `Features` | `components/home/Features.tsx` | Feature list section. | Currently not rendered | Keep available, but do not assume it is active. |

## Auth And Signup

| Component | Path | Role | Used by | Reuse notes |
| --- | --- | --- | --- | --- |
| `AuthLayout` | `components/auth/auth-layout.tsx` | Shared auth-page frame and artwork. | Signup, login, forgot/reset/verify pages | Use for auth routes only. |
| `AuthHeader` | `components/auth/auth-header.tsx` | Auth page title/subtitle block. | Auth pages | Reuse instead of placing custom auth headings. |
| `AuthDivider` | `components/auth/auth-divider.tsx` | Divider between social and email/password auth flows. | Login, signup form | Auth-only. |
| `FooterLink` | `components/auth/footer-link.tsx` | Small auth footer link text. | Login, signup form | Auth-only. |
| `SocialLogin` | `components/auth/social-login.tsx` | Social login buttons. | Login, signup form | UI-only; no real backend calls yet. |
| `SignupForm` | `components/signup/signup-form.tsx` | Signup form composition and validation wiring. | Signup page | Signup-specific composition. |
| `PhoneField` | `components/signup/phone-field.tsx` | Phone input wrapper. | Signup form | Use anywhere phone input is required. |

## Base UI

| Component | Path | Role | Used by | Reuse notes |
| --- | --- | --- | --- | --- |
| `AuthButton` | `components/ui/auth-button.tsx` | Auth-form button style. | Auth pages/forms | Auth-specific button, not the general section CTA. |
| `AuthTextField` | `components/ui/auth-text-field.tsx` | Auth text input. | Auth pages/forms | Use for auth fields. |
| `PasswordField` | `components/ui/auth-text-field.tsx` | Auth password input with visibility toggle. | Auth pages/forms | Use for password fields. |
| `Modal` | `components/ui/modal.tsx` | Accessible modal shell. | Reset password page | Generic modal; reuse for future dialogs. |

## Current Duplication Audit

- `ProductCard` is already reused correctly by home best sellers, wishlist, and the products grid.
- The products page originally duplicated the school promo banner. It now reuses `SchoolPromo` with products-page props.
- The products page still has inline pagination. Keep it inline while it is only used once; extract to a shared `Pagination` component if categories/search pages need the same control.
- `ProductsFilterControls` is products-page-specific today. Promote it only when another catalog route needs the same filter drawer.
- Product details uses a page-specific related product card inside `ProductDetailsView` because those cards include rating and add-to-cart controls that the listing `ProductCard` does not provide.
- The header/footer are global through `SiteShell`; pages should not recreate them.

## Before Creating A New Component

1. Check this file and `components/` for a component with the same visual role.
2. Prefer adding a small prop to an existing component when the structure is the same.
3. Create a new component when the behavior, data shape, or visual contract is genuinely different.
4. Keep page-specific compositions in the page or route folder until at least two places need them.

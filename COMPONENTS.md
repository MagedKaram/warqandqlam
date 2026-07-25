# Component Inventory

This file documents the current UI components so new pages reuse existing building blocks before creating new ones. The app is Arabic-only and RTL by default; keep using the configured Tailwind font tokens and CSS variables.

## Layout

| Component | Path | Role | Used by | Reuse notes |
| --- | --- | --- | --- | --- |
| `SiteShell` | `components/layout/SiteShell.tsx` | Wraps the app with cart state, then frames public pages with the route preloader, header, and footer while hiding the shell on auth routes. | `app/layout.tsx` | Use for global shell behavior only. Add route-level exceptions here if needed. |
| `Header` | `components/layout/Header/Header.tsx` | Public nav, promo bar, search popover, mobile drawer, account/cart/wishlist actions, and hydrated cart-line counter. | `SiteShell` | Do not duplicate nav/action bars or cart badges in pages. Extend this component for global header changes. |
| `Footer` | `components/layout/Footer.tsx` | Public footer with brand copy, links, and social icons. | `SiteShell` | Do not create page-specific footers unless the route is intentionally outside the public shell. |
| `RoutePreloader` | `components/layout/RoutePreloader.tsx` | Route transition loading overlay. | `SiteShell` | Shared global behavior. |

## Product And Commerce

| Component | Path | Role | Used by | Reuse notes |
| --- | --- | --- | --- | --- |
| `ProductCard` | `components/product/ProductCard.tsx` | Shared typed product tile. Its Cart-canonical `recommendation` variant owns image, badge, wishlist, price, rating, and add-to-cart behavior; `catalog` preserves the lighter listing tile. | Cart and Product Details related products, `BestSellers`, `WishlistContent`, `/products` | Reuse the card itself while keeping context-specific section wrappers separate. Add only proven visual variants. |
| `ProductsFilterControls` | `components/product/ProductsFilterControls.tsx` | Products-page sort control and RTL filter drawer. | `/products` | Page-specific for now. If category pages need filters, promote this to a generic catalog filter component. |
| `ProductDetailsView` | `components/product/ProductDetailsView.tsx` | Product detail composition: gallery, purchase controls, service strip, tabs, related products, and delivery promo. | `/products/[slug]` | Detail-page shell. Keep the route as a Server Component and put browser interactions here. |
| `SchoolPromo` | `components/home/SchoolPromo.tsx` | Reusable school-supplies promo banner with discount pill, title, CTA, and image. | Home page, `/products` | Shared by home and products. Use props for `headingLevel`, `ctaHref`, image source, and image dimensions instead of rebuilding the banner. |
| `SectionButton` | `components/home/SectionButton.tsx` | Orange CTA link with optional icon. | `PrintServices`, `SchoolPromo` | Use for section CTA links that match the orange button style. |

## Cart, Checkout, And Orders

| Component | Path | Role | Used by | Reuse notes |
| --- | --- | --- | --- | --- |
| `CartProvider` | `components/cart/CartProvider.tsx` | Unified product/printing cart reducer, safe hydration, persistence, derived counts, totals, and coupon actions. | `SiteShell` | Use `useCart`; do not create route-local cart state or new storage keys. |
| `CartPageClient` | `components/cart/CartPageClient.tsx` | Cart composition for empty, product, printing, mixed, summary, and related-product states. | `/cart` | Keep item-specific rendering in the row components. |
| `ProductCartItemRow` / `PrintingCartItemRow` | `components/cart/` | Accessible, responsive rows for the two cart-item union members. | `CartItemList` | Extend the matching row when a cart-item field changes. |
| `QuantityStepper` | `components/ui/QuantityStepper.tsx` | Shared semantic decrement/value/increment control with safe min/max bounds and the approved Cart appearance. | Product cart rows, Product Details purchase panel | Preserve decrement/value/increment DOM order, truthful Arabic labels, and focus-visible behavior. Printing copy count intentionally remains separate. |
| `OrderSummary` | `components/cart/OrderSummary.tsx` | Shared item preview, printing aggregates, coupon, shipping, discount, and total summary. | `/cart`, `/checkout` | Reuse for both routes; summary rows keep Arabic label then isolated numeric value in the DOM. |
| `CouponControl` | `components/cart/CouponControl.tsx` | Coupon input with processing, valid, invalid, and removal states. | `OrderSummary` | Coupon definitions and math stay in `lib/cart/`. |
| `CheckoutPageClient` | `components/checkout/CheckoutPageClient.tsx` | Delivery/payment composition, explicit method switching, selected-radio focus restoration, safe retry context, and shared frontend-only COD, Vodafone, Instapay, and Bank Card order orchestration. | `/checkout` | Keep payment transitions in the checkout reducer and registry. Sensitive card fields remain transient. |
| `DeliveryForm` | `components/checkout/DeliveryForm.tsx` | Semantic Arabic delivery form with validation and optional saved-information preference. | `CheckoutPageClient` | Phone and email inputs are the only LTR-isolated fields. |
| `PaymentMethodSelector` | `components/checkout/PaymentMethodSelector.tsx` | Typed payment registry selector for COD, Vodafone Cash, Instapay, and Bank Card, including the selected-input focus target used after returning from a flow. | `CheckoutPageClient` | Method labels, availability, marks, and extra-step metadata remain centralized in the registry. |
| `VodafoneCashFlow` | `components/checkout/payment-flows/VodafoneCashFlow.tsx` | Vodafone transfer instructions, PNG receipt-metadata capture, sender validation fields, and responsive details layout. | `CheckoutPageClient` | Never retain the raw `File`; validate it and pass serializable metadata into checkout state. |
| `InstapayFlow` | `components/checkout/payment-flows/InstapayFlow.tsx` | Instapay targets, QR instructions, PNG proof metadata, and sender validation. | `CheckoutPageClient` | Reuses the neutral transfer-proof fields without retaining the raw `File`. |
| `BankCardFlow` | `components/checkout/payment-flows/BankCardFlow.tsx` | Responsive cardholder/PAN/expiry/CVV prototype form with typed validation and narrow LTR input islands. | `CheckoutPageClient` | Never persist PAN, expiry, CVV, or raw form state; only brand and last four may enter a prototype order. |
| `SelectedPaymentMethodSummary` | `components/checkout/SelectedPaymentMethodSummary.tsx` | Shared selected-method row and Arabic change-method action for payment details and Order Review. | Vodafone, Instapay, Bank Card, `OrderReview` | Keep the row/action responsive RTL layout shared; processing intentionally renders no change action. |
| `OrderReview` | `components/checkout/OrderReview.tsx` | Shared review for delivery information, selected payment method, optional safe card metadata, and the shared change-method action. | `CheckoutPageClient` | Do not add payment-specific duplicate review pages or expose sensitive card values. |
| `PaymentProcessingStatus` | `components/checkout/payment-flows/PaymentProcessingStatus.tsx` | Shared frontend-prototype processing state for payment methods that require review. | `CheckoutPageClient` | Must not imply bank/provider verification or a real charge; payment switching is unavailable while processing is locked. |
| `CashOnDeliveryFlow` / `PaymentFlowPlaceholder` | `components/checkout/payment-flows/` | Approved COD note and an extensibility placeholder for future methods. | `CheckoutPageClient` | Add future method-specific flows behind the typed checkout state machine. |
| `OrderResultView` | `components/order/OrderResultView.tsx` | Shared success/failure result screen; failure offers same-method retry and change-payment navigation. | `/order/success`, `/order/failed` | Both failure actions preserve the cart and consume only safe session-scoped retry context. |

## Printing

| Component | Path | Role | Used by | Reuse notes |
| --- | --- | --- | --- | --- |
| `PrintingPageClient` | `components/printing/PrintingPageClient.tsx` | Transient file selection/preview, printing options, quote, and conversion to persisted cart metadata. | `/printing` | Never persist `File`, `Blob`, or object URLs; only pass metadata to `CartProvider`. |

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

- `ProductCard` is reused by home best sellers, wishlist, products listing, and both related-products sections. The `recommendation` variant is sourced from the approved Cart card; the `catalog` variant preserves the intentionally different listing presentation.
- The products page originally duplicated the school promo banner. It now reuses `SchoolPromo` with products-page props.
- The products page still has inline pagination. Keep it inline while it is only used once; extract to a shared `Pagination` component if categories/search pages need the same control.
- `ProductsFilterControls` is products-page-specific today. Promote it only when another catalog route needs the same filter drawer.
- Cart and Product Details keep separate related-section wrappers, but render the same shared `ProductCard` rather than duplicating card markup.
- The header/footer are global through `SiteShell`; pages should not recreate them.

## Before Creating A New Component

1. Check this file and `components/` for a component with the same visual role.
2. Prefer adding a small prop to an existing component when the structure is the same.
3. Create a new component when the behavior, data shape, or visual contract is genuinely different.
4. Keep page-specific compositions in the page or route folder until at least two places need them.

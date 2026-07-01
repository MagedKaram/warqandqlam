# Backend Integration Guide

## Current Status

The website is ready as a UI prototype, but it is not fully backend-integrated yet.
All product, wishlist, FAQ, testimonials, and company-logo content is currently
mocked in `lib/mock-data.ts`.

The safest integration path is to keep the existing reusable UI components and
replace only the mock data sources with API-backed service functions.

## Integration Readiness

- `ProductCard` is reusable and already shaped for API product lists.
- Home sections are data-driven, but currently import static arrays.
- Wishlist has both filled and empty states, but state is local-only and resets on refresh.
- Auth pages exist visually, but forms do not call a backend yet.
- There are no real product, category, cart, checkout, or account routes yet.

## Recommended API Layer

Create API helpers under `lib/api/` and keep UI components unaware of endpoint
details.

Suggested files:

- `lib/api/client.ts` - shared `fetch` wrapper, base URL, auth headers, error handling.
- `lib/api/products.ts` - product lists, best sellers, product details.
- `lib/api/wishlist.ts` - get wishlist, add item, remove item.
- `lib/api/auth.ts` - login, signup, forgot password, verify code, reset password.
- `lib/api/content.ts` - FAQs, testimonials, partners/company logos, home banners.

Use an environment variable for the backend base URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## Data Contracts

### Product

Current UI type:

```ts
export type Product = {
  id: string;
  image: string;
  title: string;
  price: number;
  href: string;
  currency?: string;
  isNew?: boolean;
  isWishlisted?: boolean;
  category?: string;
};
```

Backend product responses should be mapped into this shape before reaching UI
components. If the backend returns `slug`, build `href` as `/products/${slug}`.

### Product Detail

The detail page uses a richer UI-facing `ProductDetail` type with gallery images,
color options, services, tabs/specs/reviews, related products, and delivery promo
content. Recommended endpoint:

- `GET /products/{slug}` - returns a normalized product detail payload.

Keep listing products and product details as separate frontend shapes. If the
backend returns one large product object, map it into `Product` for cards and
`ProductDetail` for the detail page before passing data to UI components.

### Wishlist

Recommended endpoints:

- `GET /wishlist` - returns current user's wishlist products.
- `POST /wishlist/items` - body: `{ productId: string }`.
- `DELETE /wishlist/items/{productId}`.

UI behavior:

- If `GET /wishlist` returns an empty list, show the empty state.
- Filled state should pass `isWishlisted={true}` to `ProductCard`.
- Removing the last item should immediately switch to the empty state.

### Home Content

Recommended endpoints:

- `GET /home/best-sellers`
- `GET /home/testimonials`
- `GET /home/partners`
- `GET /faqs`

Keep current mock arrays as fallback data while the API is incomplete.

## Files To Change First

- Replace imports from `lib/mock-data.ts` in:
  - `components/home/BestSellers.tsx`
  - `components/home/Testimonials.tsx`
  - `components/home/CompanyLogos.tsx`
  - `components/home/Faq.tsx`
  - `app/wishlist/WishlistContent.tsx`
- Keep `ProductCard` API unchanged unless the backend contract requires a new
  field.
- Keep `types/product.ts` as the UI-facing product type and add mapper functions
  if the backend response differs.

## Auth Integration Notes

Auth routes are UI-only right now:

- `/signup`
- `/login`
- `/forgot-password`
- `/verify-code`
- `/reset-password`

When integrating:

- Add submit handlers that call `lib/api/auth.ts`.
- Store auth tokens using the backend's chosen strategy.
- Prefer HTTP-only cookies if the backend supports them.
- Redirect authenticated users away from auth pages.
- Protect wishlist/cart/account routes once real sessions exist.

## Acceptance Checklist

- `npm.cmd run lint` passes.
- `npm.cmd run build` passes.
- Home page renders when API succeeds.
- Home page has a fallback or loading state when API is slow.
- Wishlist loads real user data.
- Wishlist add/remove persists after refresh.
- Auth forms submit to backend and show API validation errors.
- Arabic/RTL layout remains unchanged.

## Important Assumptions

- This project remains frontend-only until backend endpoints are finalized.
- Mock data should stay available until every needed endpoint exists.
- UI components should receive normalized frontend types, not raw backend
  response objects.

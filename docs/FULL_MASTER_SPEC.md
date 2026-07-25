# Full Master Spec — Cart, Checkout, Payment Foundation

This file is the condensed master reference. The detailed requirements are split across the numbered specification files in this folder.

## Goal

Build a frontend-only Cart and Checkout foundation for an Arabic-only RTL Next.js storefront.

Support:

- Product items.
- Printing items.
- Mixed carts.
- Cart persistence.
- Dynamic totals.
- Shipping and coupon UI.
- Delivery form.
- Payment selection.
- Cash on Delivery prototype.
- Vodafone Cash prototype with payment details and order review.
- Instapay prototype with payment instructions, proof metadata, and order
  review.
- Bank Card prototype with transient validated fields and safe masked review
  metadata.
- Extensible payment architecture.
- Success and failure pages.

## Current payment scope

Implemented now:

- Cash on Delivery.
- Vodafone Cash.
- Instapay.
- Bank Card.

No real payment-provider integration is approved in the current frontend-only
scope.

Do not invent missing steps.

## Core architecture

Use:

- Typed discriminated cart-item union.
- Centralized reducer/store.
- Versioned localStorage modules.
- Centralized calculations/config.
- Checkout state machine.
- Centralized payment registry.
- Isolated payment-flow components.

## Core routes

- `/cart`
- `/checkout`
- `/order/success`
- `/order/failed`

## Core rules

- Root RTL remains active.
- No broad LTR wrappers.
- Semantic DOM order.
- Explicit Grid placement for required physical columns.
- Narrow LTR isolation for complete numeric/Latin values.
- No raw files in localStorage.
- No real payment gateway or backend in this phase.
- No unrelated redesigns.

## Required verification

```bash
npm.cmd run lint
npm.cmd run build
git diff --check
```

Test desktop and mobile, including mixed-cart and failure/success states.

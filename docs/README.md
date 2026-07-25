# Warq & Qalam — Cart & Checkout Specs

This folder contains the complete frontend specification for the Cart, Checkout, Payment Architecture, and Order Result flows.

## Source references

Use these local screenshots as the visual source of truth:

- `D:\websites\warqandqlam\screen\cart.png`
- `D:\websites\warqandqlam\screen\cart-1.png`
- `D:\websites\warqandqlam\screen\cart-2.png`
- `D:\websites\warqandqlam\screen\cart-3.png`
- `D:\websites\warqandqlam\screen\failedorder.png`
- `D:\websites\warqandqlam\screen\succesfulorder.png`
- `D:\websites\warqandqlam\screen\vodafone.png`
- `D:\websites\warqandqlam\screen\vodafone-1.png`
- `D:\websites\warqandqlam\screen\vodafone-3.png`
- `D:\websites\warqandqlam\screen\instapay.png`
- `D:\websites\warqandqlam\screen\bank.png`
- `D:\websites\warqandqlam\screen\ordersummry.png`

The Vodafone Cash screenshots approve its payment-details flow. The Instapay
screenshot approves its transfer-details/proof flow, which continues into the
shared order-review architecture.
The Bank Card screenshot now approves its card-details form and use of the
shared review/processing architecture. It does not approve a real gateway,
OTP, 3DS, redirects, or storage of sensitive card values.

## Required reading order

1. `00-project-rules-and-scope.md`
2. `01-existing-code-audit.md`
3. `02-cart-data-model-and-store.md`
4. `03-cart-page-spec.md`
5. `04-checkout-delivery-spec.md`
6. `05-payment-architecture-spec.md`
7. `06-order-success-failure-spec.md`
8. `07-rtl-responsive-accessibility.md`
9. `08-testing-and-acceptance.md`
10. `09-pending-payment-flows.md`

## Current implementation boundary

Implement now:

- Unified cart foundation.
- Product and printing items.
- Cart state and persistence.
- Cart page.
- Checkout delivery information.
- Payment-method selection.
- Cash on Delivery frontend prototype.
- Vodafone Cash frontend prototype with receipt metadata and order review.
- Instapay frontend prototype with QR instructions, receipt metadata, and the
  shared order review.
- Bank Card frontend prototype with transient validated fields, safe masked
  review metadata, and the shared order review.
- Success and failure pages.
- Extensible payment-flow architecture.

Do not implement yet:

- Real backend or database.
- Real payment gateway.
- Real card processing, OTP, 3DS, redirects, tokenization, or gateway handling.

Use `CODEX_START_PROMPT.md` to ask Codex to inspect these files and turn them into an implementation plan before writing code.

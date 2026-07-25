# Simple Codex Prompt — Review and Split into Specs

Read all Markdown files inside:

```text
warqandqlam_cart_checkout_specs/
```

Also inspect these visual references:

```text
D:\websites\warqandqlam\screen\cart.png
D:\websites\warqandqlam\screen\cart-1.png
D:\websites\warqandqlam\screen\cart-2.png
D:\websites\warqandqlam\screen\cart-3.png
D:\websites\warqandqlam\screen\failedorder.png
D:\websites\warqandqlam\screen\succesfulorder.png
D:\websites\warqandqlam\screen\vodafone.png
D:\websites\warqandqlam\screen\vodafone-1.png
D:\websites\warqandqlam\screen\vodafone-3.png
D:\websites\warqandqlam\screen\bank.png
```

Do not implement code yet.

Your task now is to:

1. Inspect the current project and compare it with all supplied specs and screenshots.
2. Identify existing reusable code, missing architecture, conflicts, and risks.
3. Review the current spec split and improve it when necessary.
4. Create an implementation plan under a new project folder such as:

```text
specs/cart-checkout/
```

5. Produce small, dependency-ordered implementation specs.
6. Each implementation spec must contain:
   - Goal.
   - Scope.
   - Files expected to change.
   - Dependencies.
   - Data/types required.
   - UI states.
   - RTL decisions.
   - Responsive behavior.
   - Interaction behavior.
   - Acceptance criteria.
   - Verification commands.
   - Screenshot requirements.
   - Out-of-scope items.
7. Treat the supplied Vodafone Cash, Instapay, and Bank Card screenshots as approved; do not invent gateway, OTP, 3DS, or redirect steps.
8. Fully plan Cash on Delivery and the approved Vodafone Cash, Instapay, and Bank Card frontend prototype flows.
9. Do not change product data or existing approved Product Details RTL behavior.
10. Do not commit.

Return:

- Audit summary.
- Proposed spec filenames.
- Dependency graph/order.
- Risks and unresolved questions.
- Recommended first implementation spec.

Stop after planning and writing the specs. Do not start implementation until the plan is reviewed.

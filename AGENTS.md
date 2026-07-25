# AGENTS.md

## Stack

- Next.js 16 with App Router.
- React 19.
- TypeScript with `strict` enabled.
- Tailwind CSS v4.
- Project folders: `app/`, `components/`, `lib/`, `types/`.

<!-- BEGIN:nextjs-agent-rules -->
## Next 16 Note

This is not older Next.js. This version may have breaking changes in APIs,
conventions, and file structure. Read the relevant guide in
`node_modules/next/dist/docs/` before writing framework-specific code and heed
deprecation notices.
<!-- END:nextjs-agent-rules -->

# Arabic RTL Architecture Rules

These rules are mandatory for every future implementation and every component
modified by a task. The corrected Product Details hero in
`components/product/ProductDetailsView.tsx` is the approved reference. Read
`docs/RTL_ARCHITECTURE.md` for the detailed patterns and examples.

## Language, Fonts, And Root Direction

- This is an Arabic-only product. Do not build a complete English or LTR
  interface unless a task explicitly changes the product scope.
- Keep the application root exactly `<html lang="ar" dir="rtl">` and let normal
  Arabic UI inherit it.
- Do not repeat `dir="rtl"` on normal Arabic pages, sections, cards, forms, or
  components. Add it only when returning to Arabic inside a narrowly isolated
  LTR context.
- Headings use Amiri through `font-heading`; body copy uses Cairo through
  `font-body`. Never hardcode `font-family`; use the configured `next/font`
  variables and Tailwind font tokens.

## Direction Is Content, Not Layout

- Never use a large `dir="ltr"` wrapper to position columns, cards, controls,
  forms, headers, footers, galleries, tabs, accordions, buttons, or product UI.
- Never add a global RTL rule that reverses every flex or grid container.
- Use semantic JSX order first. Use explicit CSS Grid placement when a design
  requires a fixed physical side that differs from natural RTL flow.
- Prefer logical utilities such as `text-start`, `ms-*`, `me-*`, `ps-*`,
  `pe-*`, `start-*`, and `end-*`. Use physical `left-*` or `right-*` only when
  the design requirement is genuinely physical, such as an image overlay.
- Remember that `items-start` is the physical right for an RTL column flexbox;
  do not use `items-end` expecting right alignment.

## Semantic DOM And Stable Data Order

- JSX order must follow the logical Arabic reading and interaction order.
- Do not create incorrect DOM order and repair it with `flex-row-reverse`,
  `order-*`, broad LTR wrappers, reversed arrays, absolute positioning, or
  duplicated desktop/mobile markup.
- Labels precede their values or controls in the DOM. Primary actions precede
  secondary actions. Quantity controls use decrement, value, increment DOM
  order with truthful Arabic accessible labels.
- Preserve business/data array order. Do not call `reverse()` or copy/reverse
  data for layout. A narrowly scoped layout reversal is allowed only when the
  DOM is already semantic and Figma explicitly requires a fixed physical
  sequence, as with the Product Details swatches.

## BiDi Isolation

- Keep Arabic containers RTL. Isolate only the smallest complete Latin or
  numeric value with `<bdi dir="ltr">`.
- Typical isolates are a price, SKU, phone number, rating value, file size,
  code, or English brand name. Do not put `dir="ltr"` on the whole row.
- Keep mixed-language names intact with a narrow `bdi` and
  `whitespace-nowrap` when wrapping would corrupt the name.

## Responsive And Accessible RTL

- Use bounded responsive containers, `min-w-0`, `max-w-full`, and internal
  scrollers where needed. Do not use `w-screen`, `100vw`, oversized fixed
  widths, negative margins, transforms, or browser zoom to conceal layout
  errors.
- Do not rely on global `overflow-x: hidden` or `overflow-x: clip`. For changed
  UI, verify `document.documentElement.scrollWidth <= window.innerWidth` at
  360, 390, 768, 1024, the supplied Figma desktop width, and 1440 pixels.
- Interactive controls keep their meaning at every breakpoint, expose Arabic
  accessible names, retain visible keyboard focus, and must be tested by
  behavior rather than icon position alone.

## Legacy Scope

- Do not perform an unrelated project-wide visual refactor while implementing
  a feature.
- Fix a legacy RTL issue when its component is modified by the task. Fix shared
  RTL code when it directly affects the requested feature.
- Report unrelated legacy RTL issues without changing them unless the task
  explicitly includes them.

## Frontend Only

- This project is UI-only for now.
- Do not add real backend calls yet.
- Use mock data from `lib/` until the separate backend API is ready.

## Figma MCP

- Before implementing UI from Figma, pull variables/tokens with Figma MCP.
- Use existing Figma variables and Tailwind tokens instead of hardcoding values
  in components.
- If a requested token type is not exposed by Figma MCP, document the gap and
  keep the fallback centralized in Tailwind config or global theme files.
- After building UI from a Figma frame, screenshot-compare the local result with
  the source frame before considering the work complete.

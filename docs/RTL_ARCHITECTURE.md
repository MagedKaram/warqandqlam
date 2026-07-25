# Arabic RTL Architecture

This document defines the permanent RTL, responsive, and bidirectional-text
architecture for Warqa w Qalam. The website is Arabic-only; a complete English
or LTR interface is not a product requirement.

The corrected Product Details hero in
`components/product/ProductDetailsView.tsx` is the approved implementation
reference. These rules apply to every new feature and every existing component
modified by a task.

## 1. Scope And Legacy Policy

- New UI must follow this document from the start.
- When a task modifies a legacy component, correct RTL problems in the touched
  code rather than preserving a known anti-pattern.
- Correct shared RTL code when it directly affects the requested feature.
- Report unrelated legacy problems, but do not expand the task into a visual
  refactor unless the user explicitly requests it.
- Do not duplicate a desktop component and a mobile component to work around
  ordering problems. Use one semantic component tree and responsive CSS.

## 2. Root Direction And Natural Inheritance

The root layout is the single normal source of direction:

```tsx
<html lang="ar" dir="rtl">
  <body>{children}</body>
</html>
```

Arabic pages, sections, cards, forms, and controls inherit this direction. They
must not repeat `dir="rtl"`.

The only normal reasons to add a nested direction are:

1. A narrow value or field genuinely reads LTR.
2. Arabic content must re-enter RTL inside that narrow LTR island.
3. Embedded third-party content has an independently defined direction.

Do not add a wide `dir="ltr"` wrapper to arrange UI. Direction describes
content and inline flow; it is not a column-placement API.

## 3. Direction Is Not Physical Placement

Never change direction to move any of these to a physical side:

- columns or cards;
- labels and values;
- galleries or thumbnail rails;
- forms and controls;
- headers or footers;
- tabs or accordions;
- buttons or product information.

Use normal RTL flow when it matches the design. When Figma requires a fixed
physical composition, keep semantic DOM order and use explicit Grid placement.

### Approved two-column pattern

The Product Details DOM keeps information before the gallery. The grid places
the 533px gallery on the physical right and the 538px information panel on the
physical left:

```tsx
<div className="mx-auto grid w-full max-w-[1111px] grid-cols-1 gap-10 xl:grid-cols-[533px_538px]">
  <section className="xl:col-start-2 xl:row-start-1">
    {/* Product information */}
  </section>

  <section className="xl:col-start-1 xl:row-start-1">
    {/* Gallery */}
  </section>
</div>
```

In an RTL grid, line 1 begins at the physical right. Do not assume that CSS
Grid line numbers have LTR geometry; verify the result in the browser.

### Approved gallery pattern

The active image remains first in the DOM. Explicit columns put the thumbnail
rail on the physical right without changing content direction:

```tsx
<div className="grid grid-cols-[80px_421px] gap-8">
  <div className="col-start-2 row-start-1">{/* Main image */}</div>
  <div className="col-start-1 row-start-1">{/* Thumbnails */}</div>
</div>
```

Below the desktop breakpoint, keep the main image and thumbnail controls in the
same DOM tree and make the rail a bounded horizontal scroller when required.

### RTL flex alignment

For `flex-col`, the cross-axis follows the inline direction:

- `items-start` aligns to RTL inline-start, the physical right.
- `items-end` aligns to RTL inline-end, the physical left.

Do not use `items-end` expecting it to mean “align Arabic content right.”

## 4. Semantic DOM Order

DOM order must match Arabic reading order, screen-reader order, focus order, and
action meaning. CSS may place a semantic group, but it must not repair an
incorrect DOM.

Do not fix incorrect JSX by using:

- a broad `dir="ltr"`;
- `flex-row-reverse` or `order-*` as a general ordering strategy;
- reversed or mutated data arrays;
- absolute positioning of ordinary content;
- duplicated desktop/mobile markup.

Absolute positioning remains valid for a genuine overlay, such as a discount
badge or wishlist button on an image, provided DOM and accessible order remain
correct.

### Label and value

The Arabic label precedes its value in the DOM. The value alone is isolated:

```tsx
<div className="flex w-full items-center justify-between gap-4">
  <span className="min-w-0 text-start">المجموع الفرعي</span>

  <bdi dir="ltr" className="shrink-0 whitespace-nowrap">
    0 LE
  </bdi>
</div>
```

Do not put `dir="ltr"` on the row.

### Mixed Arabic and English title

```tsx
<h1 className="w-full text-start font-body">
  <span>أدوات الهندسة الاحترافية من </span>
  <bdi dir="ltr" className="whitespace-nowrap">
    AMS PLUS
  </bdi>
</h1>
```

The Arabic heading inherits RTL. Only the English name is isolated, and it
cannot split internally on mobile.

### Prices

Current price precedes previous price in the DOM. Each complete price is one
LTR isolate:

```tsx
<div className="flex items-center gap-6">
  <bdi dir="ltr" className="whitespace-nowrap">
    65 EGP
  </bdi>
  <bdi dir="ltr" className="whitespace-nowrap line-through">
    80 EGP
  </bdi>
</div>
```

Do not isolate only the digits or make the complete price row LTR.

### Rating information

Keep the meaningful DOM sequence stable:

1. Rating visualization.
2. Numeric rating value.
3. Review count.
4. Supporting sales text.

Icons that are purely visual use `aria-hidden`. Numeric values use a narrow
`bdi`; the complete row continues to inherit RTL.

### Quantity control

The semantic action order is always decrement, value, increment:

```tsx
<div
  aria-labelledby="quantity-label"
  className="flex items-center gap-4"
  role="group"
>
  <span id="quantity-label">الكمية:</span>

  <div className="flex items-center gap-6">
    <button type="button" aria-label="تقليل الكمية" onClick={decrease}>
      <MinusIcon aria-hidden />
    </button>

    <bdi dir="ltr" aria-live="polite">
      {quantity}
    </bdi>

    <button type="button" aria-label="زيادة الكمية" onClick={increase}>
      <PlusIcon aria-hidden />
    </button>
  </div>
</div>
```

Under inherited RTL this naturally produces the approved physical arrangement:
minus on the right, value in the middle, plus on the left. Test behavior: plus
must increase and minus must decrease. Never swap handlers or accessible names
to make the icons look correct.

### Primary and secondary actions

Primary action precedes secondary action in the DOM:

```tsx
<div className="grid grid-cols-2 gap-4 xl:gap-8">
  <button type="button">أضف للسلة</button>
  <button type="button">اشتري الآن</button>
</div>
```

An inherited RTL grid places the first action at RTL start. Keep that semantic
order when the buttons wrap or stack.

## 5. Ordered Data And Visual Tracks

Data order is a business rule, not a layout knob.

- Do not use `reverse()`, `toReversed()`, or a copied/reversed array to repair
  RTL layout.
- Do not change product data solely to change physical position.
- Prefer explicit Grid placement for distinct regions.
- Preserve keys, selection state, and keyboard order when the layout changes.

### Narrow local reversal exception

A local reversal is allowed only when all of these are true:

1. The DOM and data are already in correct semantic/business order.
2. The reference explicitly requires that sequence on a fixed physical track.
3. The reversal is limited to that track and does not change surrounding
   direction.
4. Focus and interaction meaning remain correct.

The Product Details swatch strip is the approved example: the color array stays
red, blue, green, black, while a local layout rule maps it to the Figma track.
This exception must never become a global `[dir="rtl"]` reversal rule.

## 6. BiDi Isolation

Use `<bdi dir="ltr">` for the smallest complete atomic value that reads LTR.

| Content | Required treatment |
| --- | --- |
| Arabic copy | Inherit root RTL |
| English brand name | Narrow `bdi`, normally `whitespace-nowrap` |
| Complete price such as `65 EGP` | One narrow `bdi` |
| SKU or code | Narrow `bdi` |
| Rating value | Narrow `bdi` |
| Phone number | Narrow `bdi` or LTR input itself |
| File size | Narrow `bdi` |
| Email or URL | Narrow `bdi`, link, or input itself |
| Gallery/card/form layout | Never change direction for placement |

An input may use `dir="ltr"` when the value itself is a phone number, code,
email, or URL. Its Arabic label, help text, validation, and surrounding layout
remain inherited RTL.

Avoid wide custom `unicode-bidi` or CSS `direction` rules. Prefer semantic
isolation in markup so the scope is visible during review.

## 7. Logical And Physical CSS

Prefer logical Tailwind utilities for normal Arabic UI:

- `text-start` and `text-end`;
- `ms-*` and `me-*`;
- `ps-*` and `pe-*`;
- `start-*` and `end-*`;
- logical borders where available.

Physical `left-*` and `right-*` are acceptable only when the requirement is
truly physical and independent of text direction. Examples include a wishlist
button fixed to the physical left of an image and a discount badge fixed to its
physical right.

Never add a global selector that reverses flex containers under RTL. Never use
negative margins, `scale()`, transforms, or browser zoom to fake a reference.

## 8. Responsive Architecture

Use bounded, fluid containers rather than filling or oversizing the viewport:

```tsx
<section className="mx-auto w-full max-w-[1111px] px-4 md:px-6">
  {/* Responsive content */}
</section>
```

Use the measured reference width in place of `1111px` for other frames.

Required practices:

- Add `min-w-0` to flex/grid children that must shrink.
- Use `w-full` and `max-w-full` for responsive controls and media.
- Keep fixed desktop tracks behind a breakpoint where they actually fit.
- Let text wrap naturally; protect only atomic BiDi values.
- Put overflow on the child that owns it, such as a thumbnail rail, tabs, or a
  carousel.
- Avoid `w-screen`, `100vw`, and oversized fixed widths inside padded layouts.
- Do not hide an overflow defect with global clipping.

For changed responsive UI, test at:

- 360px;
- 390px;
- 768px;
- 1024px;
- the supplied Figma desktop viewport or bounded frame width;
- 1440px.

At each width verify:

```js
document.documentElement.scrollWidth <= window.innerWidth
```

Also inspect bounding rectangles. Off-viewport children are allowed only when
contained by a deliberate local scroller. Temporarily disabling global
`overflow-x` clipping is a useful audit check.

## 9. Accessibility Requirements

- DOM order, visual reading order, tab order, and action meaning must agree.
- Prefer native buttons, links, inputs, and fieldsets.
- Icon-only controls require Arabic accessible names.
- Decorative icons use `aria-hidden`.
- Stateful controls expose `aria-pressed`, `aria-selected`, `aria-expanded`, or
  native checked state as appropriate.
- Labels must be programmatically associated with their controls or groups.
- Keyboard focus must remain visibly distinguishable.
- Do not keep hidden duplicate mobile controls in the accessibility tree.
- Test behavior directly; do not infer action identity from icon position.

## 10. Figma Workflow

When a task supplies Figma:

1. Pull Figma variables and tokens before implementation.
2. Inspect the exact source frame and screenshot; do not rely on assumptions
   about how RTL should appear.
3. Measure bounded width, margins, tracks, gaps, text blocks, controls, and
   vertical rhythm.
4. Preserve existing theme tokens. If Figma does not expose a needed token,
   document the gap and centralize any fallback.
5. Screenshot-compare the changed route at the same viewport.
6. Test interaction and responsive behavior, not only static appearance.
7. Remove temporary debugging selectors or measurement code.

## 11. Review And Search Checklist

For every touched component, inspect its JSX order and search the relevant
scope for:

- `dir="ltr"`, `dir="rtl"`, and CSS `direction`;
- `flex-row-reverse`, RTL variants, and `order-*`;
- `grid-flow-*`, `col-start-*`, and `col-end-*`;
- `items-start/end`, `self-start/end`, and `justify-between`;
- physical `left/right`, margins, padding, and text alignment;
- array reversal or sorting performed for layout;
- absolute positioning of ordinary content;
- `w-screen`, `100vw`, oversized fixed widths, and negative margins;
- global or local overflow clipping;
- duplicated responsive markup.

Then verify:

- root direction still equals `<html lang="ar" dir="rtl">`;
- Arabic content inherits RTL naturally;
- only atomic LTR values are isolated;
- semantic DOM and accessible names are correct;
- responsive overflow checks pass;
- relevant stateful interactions work;
- Figma screenshots match when applicable;
- `npm.cmd run lint` passes;
- `npm.cmd run build` passes.

## 12. Decision Guide

| Requirement | Use |
| --- | --- |
| Normal Arabic content | Inherited root RTL |
| Atomic Latin/numeric token | `<bdi dir="ltr">` |
| Self-contained LTR input | Narrow `dir="ltr"` on the input |
| Fixed physical composition | Explicit Grid placement |
| Ordered business data | Preserve array and semantic DOM |
| Responsive variation | CSS on one component tree |
| Unrelated legacy RTL issue | Report without modifying |


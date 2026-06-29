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

## Arabic And RTL

- The product is Arabic-first.
- Keep `<html lang="ar" dir="rtl">`.
- Headings = Amiri (`font-heading`), body = Cairo (`font-body`).
- Never hardcode `font-family`; use the configured `next/font` variables and
  Tailwind font tokens.
- Build layouts and interaction flows with RTL direction as the default.

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

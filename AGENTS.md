# Agent instructions — PIT.CODES

## Product

Build the premier **OBD code** + **dash light** reference: fast, accurate, mobile-first, SEO-strong, monetized without spam. Read `VISION.md` and `docs/REPO_STRUCTURE.md`.

## Skills (required)

| Skill | Path |
|-------|------|
| Velite collections / SEO schemas | `.agents/skills/velite/SKILL.md` |
| MDX articles + affiliate frontmatter | `.agents/skills/articles/SKILL.md` |
| Ads + affiliate placement | `.agents/skills/monetization/SKILL.md` |

Before generating MDX, load the **articles** skill and the matching schema in `velite.config.ts`.

## Content rules

- Prefer structured collection data over one-off hardcoded pages.
- Internal link codes ↔ dash lights via `relatedObdCodes` / related products.
- Never invent OBD definitions or affiliate URLs.
- Empty route files are not done — implement read from `.velite` / `#site/content`.

## Repo layout

- Data: `content/`
- UI: `app/`, `components/`
- Generators: `lib/scripts/`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

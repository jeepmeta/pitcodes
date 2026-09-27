# PIT.CODES

Fast, accurate **OBD-II code** and **dashboard warning light** lookup. Mobile-first. SEO-optimized. Monetized without spam.

See [VISION.md](./VISION.md) and [docs/REPO_STRUCTURE.md](./docs/REPO_STRUCTURE.md).

## Stack

- **Next.js** (App Router) + Tailwind
- **Velite** content collections (typed JSON + MDX)
- Local OBD dataset + dash icon SVGs
- Affiliate + ad components in `components/monetization/`

## Quick start

```bash
npm install
npm run generate:icons   # dashboard JSON/SVG pipeline
npm run dev              # icons + velite + next dev
```

```bash
npm run build            # icons + velite + next build
```

## Content

| Path | Purpose |
|------|---------|
| `content/codes/` | Per-code OBD JSON (Velite `codes`) |
| `content/code-db/raw-codes.json` | Bulk source for code generation |
| `content/dashboard-icons/` | Dash light metadata + `svg/` |
| `content/articles/**` | MDX guides, reviews, comparisons |

Generate article MDX only via **`.agents/skills/articles`** so frontmatter matches `velite.config.ts` and affiliate URLs stay valid.

## Routes

- `/codes` · `/codes/[code]` — OBD lookup
- `/dash-lights` · `/dash-lights/[slug]` — dash icon gallery + detail
- `/guides/[slug]` — troubleshooting, decisions, comparisons
- `/reviews/[slug]` — product deep-dives
- `/articles` — editorial index

## Agents

| Skill | When to use |
|-------|-------------|
| `.agents/skills/velite` | Schema / collection changes |
| `.agents/skills/articles` | Writing or bulk-generating MDX |
| `.agents/skills/monetization` | Ad slots, affiliate blocks, disclosure |

## License

Private — all rights reserved.

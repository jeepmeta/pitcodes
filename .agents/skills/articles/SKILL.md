---
name: articles
description: Generate consistent MDX articles for PIT.CODES matching velite.config.ts with SEO frontmatter, FAQ, and affiliate honesty.
---

# PIT.CODES Article Writing

Use this skill whenever creating or editing MDX under `content/articles/`.

## Example files (copy patterns from here)

| Example | Path |
|---------|------|
| Decision guide | `.agents/skills/articles/examples/decision-clear-cel.mdx` |
| Deep code guide | `.agents/skills/articles/examples/deep-p0300.mdx` |

Examples use `draft: true` and empty affiliate URLs on purpose. Do not publish until covers + real tracked links exist.

## Rules

1. **Schema first** — frontmatter must satisfy the matching collection in `velite.config.ts`.
2. **SEO** — `title` 50–60 chars (max 70), `description` 150–160, optional `focusKeyword`, unique `slug`, real `cover` + `coverAlt`.
3. **FAQ** — add 2–4 `faq` items for FAQPage JSON-LD on high-intent topics.
4. **E-E-A-T** — `publishedAt`; set `updatedAt` / `lastReviewed` on revisions.
5. **Affiliate honesty** — only real tracked URLs; placeholders only while `draft: true`.
6. **No spam** — one primary product CTA; body may use `<AffiliateCallout />` sparingly.
7. **Accuracy** — align OBD/light claims with `content/codes` and `dashboard-icons`.
8. **Draft** — `draft: true` until ready to index.

## Collection → path → permalink

| Collection | Path | Permalink |
|------------|------|----------|
| ComparisonArticle | `content/articles/comparisons/*.mdx` | `/guides/{slug}` |
| DeepDiveArticle | `content/articles/codes/*.mdx` | `/codes/{CODE}/guide` |
| DeepProductArticle | `content/articles/products/*.mdx` | `/reviews/{slug}` |
| TroubleshootingArticle | `content/articles/troubleshooting/*.mdx` | `/guides/{slug}` |
| DecisionArticle | `content/articles/decisions/*.mdx` | `/guides/{slug}` |

## Workflow

1. Read `velite.config.ts` for the target collection.
2. Copy the closest example from `examples/`.
3. Replace placeholder cover paths and affiliate URLs.
4. Run `npm run content` or `npm run build` and fix schema errors.
5. Link to live `/codes/XXXX` and `/dash-lights/{id}` pages.

## Body structure

1. Direct answer first screen
2. Context / symptoms
3. Steps
4. Related codes/lights
5. One tool/parts CTA max
6. When to see a pro

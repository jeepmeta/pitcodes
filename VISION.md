# PIT.CODES — Vision

SEO-first site for **OBD-II code lookup** and **dashboard warning light identification**, with supporting guides, comparisons, and reviews.

## Goals

1. **Fast answers** — user lands on the exact code or dash light; gets meaning, causes, fixes, related codes/parts in seconds.
2. **Premier authority** — accurate, structured, E-E-A-T-aware content (ASE-framed review, clear dates, no fluff).
3. **Monetize without spam** — sparse, contextual ads + relevant affiliate CTAs (scanners, fluids, sensors) tied to the problem on the page. Never carpet-bomb.
4. **Simple & mobile-first** — dense information, large tap targets, minimal chrome.

## Product surfaces

| Surface | Route | Content source |
|---------|--------|----------------|
| OBD code lookup | `/codes`, `/codes/[code]` | Velite `codes` (+ optional deep-dive MDX) |
| Dash light gallery | `/dash-lights`, `/dash-lights/[slug]` | Velite `dashboardIcons` + SVGs |
| Guides / how-tos | `/guides/[slug]` | troubleshooting, decisions, comparisons |
| Reviews | `/reviews/[slug]` | product deep-dives |
| Articles index | `/articles` | aggregated editorial |

## Content system

- **Velite** collections in `velite.config.ts` (typed, SEO fields required).
- **Local data**: `content/code-db/` (raw OBD dump), `content/codes/` (per-code JSON), `content/dashboard-icons/` (JSON + `svg/`).
- **MDX articles**: `content/articles/{comparisons,codes,products,troubleshooting,decisions}/`.
- **Agent skills**: `.agents/skills/velite`, `articles`, `monetization` — required when generating content so affiliate links and schemas stay consistent.

## Monetization principles

- One primary affiliate block per page, matched to `relatedProducts` / repair context.
- Ad slots only via `components/monetization/*` — no ad-hoc junk in MDX except documented MDX components.
- Affiliate disclosure: `/affiliate-disclaimer` in footer.
- Prefer helpful tools (OBD scanners, TPMS, fluids) over generic merch.

## Non-goals

- Not a forum or user-generated diagnosis.
- Not thin doorway pages — every money page must fully answer the query.
- Not desktop-only or design-theater.

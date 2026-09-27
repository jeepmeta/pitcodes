---
name: monetization
description: Place ads and affiliate CTAs on PIT.CODES without spam. Use when adding AdSlot, AffiliateCallout, ProductGrid, or affiliate fields in MDX/frontmatter.
---

# Monetization (non-spam)

## Principles

- **Relevance over density** — one primary offer per page, tied to the fault or task.
- **Components only** — use `components/monetization/*`; do not paste raw ad scripts into MDX.
- **Disclosure** — footer + `/affiliate-disclaimer`; visible “Affiliate link” labeling on CTAs.
- **Performance** — lazy-load ad slots below the fold when possible; never block LCP.

## Components

| Component | Use |
|-----------|-----|
| `AdSlot` | Display inventory; props: `slotId`, `placement` (`inline` \| `sidebar` \| `after-content`) |
| `AffiliateCallout` | Single product CTA; props: `title`, `href`, `blurb`, `rel="sponsored noopener"` |
| `ProductGrid` | 2–4 related products max on long guides |

## Placement map

| Page type | Ads | Affiliate |
|-----------|-----|----------|
| `/codes/[code]` | 1 after primary content | Scanner/tools matching severity |
| `/dash-lights/[slug]` | 1 after solutions | Parts from `relatedProducts` |
| Long MDX guide | 1 mid-article + 1 end | Winning pick / required tools |
| Home / indexes | 0–1 discreet | None required |

## Do not

- Auto-play video ads in content
- Interstitials on mobile before content
- More than two ad slots on a single mobile article view
- Affiliate links in the first paragraph before the answer

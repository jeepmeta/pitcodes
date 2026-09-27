---
name: articles
description: Generate consistent MDX articles for PIT.CODES (comparisons, deep code guides, product reviews, troubleshooting, decision guides) matching velite.config.ts schemas with accurate affiliate links and SEO frontmatter.
---

# PIT.CODES Article Writing

Use this skill whenever creating or editing MDX under `content/articles/`.

## Rules

1. **Schema first** — frontmatter must satisfy the matching collection in `velite.config.ts`. Invalid builds fail; do not invent fields.
2. **SEO** — `title` 50–60 chars (max 70), `description` 150–160 chars, unique `slug`, real `cover` + `coverAlt`.
3. **E-E-A-T** — always set `publishedAt`; set `updatedAt` on revisions; keep default author/reviewer unless instructed otherwise.
4. **Affiliate honesty** — only include `affiliateUrl` values the user provided or that exist in project affiliate config. Never invent tracking URLs.
5. **No spam** — at most one primary product CTA in frontmatter; body can reference tools via MDX `<AffiliateCallout />` sparingly (see monetization skill).
6. **Accuracy** — OBD codes, symptoms, and fixes must align with `content/codes` / `dashboard-icons` data when the article is about a specific code or light.
7. **Draft** — use `draft: true` until ready to index.

## Collection → path → permalink

| Collection | Path | Permalink |
|------------|------|----------|
| ComparisonArticle | `content/articles/comparisons/*.mdx` | `/guides/{slug}` |
| DeepDiveArticle | `content/articles/codes/*.mdx` | `/codes/{CODE}/guide` |
| DeepProductArticle | `content/articles/products/*.mdx` | `/reviews/{slug}` |
| TroubleshootingArticle | `content/articles/troubleshooting/*.mdx` | `/guides/{slug}` |
| DecisionArticle | `content/articles/decisions/*.mdx` | `/guides/{slug}` |

## Frontmatter templates

### Comparison (`articles/comparisons`)

```yaml
---
title: "Best OBD2 Scanners for 2026 (Tested)"
slug: best-obd2-scanners-2026
description: "Compare top OBD2 scanners for DIY diagnosis—features, price tiers, and which tool fits home vs pro use."
keywords: [obd2 scanner, best code reader, diagnostic tool]
robots: index, follow
publishedAt: 2026-09-01
updatedAt: 2026-09-27
author: PIT.CODES Automotive Team
reviewer: ASE Certified Master Technician
draft: false
cover: ../../assets/covers/scanners-2026.jpg
coverAlt: OBD2 scanners on a workbench
itemCount: 5
winningPick:
  name: Example Pro Scanner
  rating: 4.6
  affiliateUrl: https://example.com/aff/REPLACE
  summary: Best overall for live data and reliability.
budgetPick:
  name: Example Budget Reader
  rating: 4.1
  affiliateUrl: https://example.com/aff/REPLACE
  summary: Fine for basic code read/clear.
---
```

### Deep code guide (`articles/codes`)

```yaml
---
title: "P0300 Misfire — Causes, Diagnosis, Fix"
slug: p0300-misfire-guide
code: P0300
description: "What P0300 means, how to diagnose random misfires, common causes, and repair steps with realistic cost ranges."
keywords: [P0300, random misfire, cylinder misfire]
publishedAt: 2026-09-01
cover: ../../assets/covers/p0300.jpg
coverAlt: Engine bay during misfire diagnosis
urgencyScore: 8
affectedSystems: [Ignition, Fuel, Air intake]
diagnosticDifficulty: Intermediate
estimatedRepairTime: 1–4 hours
draft: false
---
```

### Product review (`articles/products`)

```yaml
---
title: "Example Scanner Review — Worth It?"
slug: example-scanner-review
productName: Example Scanner X1
brand: Example
model: X1
description: "Hands-on style review of the Example Scanner X1—setup, features, limitations, and who should buy it."
publishedAt: 2026-09-01
cover: ../../assets/covers/example-scanner.jpg
coverAlt: Example Scanner X1 package and screen
rating: 4.4
priceTier: $$
affiliateUrl: https://example.com/aff/REPLACE
pros: [Fast pairing, Clear UI]
cons: [Limited bi-directional]
verdict: Strong DIY pick if you need live data without pro pricing.
draft: false
---
```

### Troubleshooting (`articles/troubleshooting`)

```yaml
---
title: "Car Won't Start but Lights Work"
slug: wont-start-lights-work
symptom: Cranks poorly or no-start while exterior lights work
description: "Step-by-step checks when the car won't start but lights still work—battery, starter, immobilizer, fuel."
publishedAt: 2026-09-01
cover: ../../assets/covers/no-start.jpg
coverAlt: Driver attempting to start a vehicle
difficulty: Beginner
estimatedTime: 30–90 minutes
requiredTools:
  - name: Basic OBD2 scanner
    affiliateUrl: https://example.com/aff/REPLACE
  - name: Multimeter
safetyWarnings: [Secure vehicle in park, wear eye protection]
draft: false
---
```

### Decision guide (`articles/decisions`)

```yaml
---
title: "Should You Clear a Check Engine Light?"
slug: should-you-clear-check-engine-light
decisionTopic: Clearing CEL without fixing the cause
description: "When clearing a check engine light is fine, when it is a bad idea, and how it affects emissions readiness."
publishedAt: 2026-09-01
cover: ../../assets/covers/cel-clear.jpg
coverAlt: Check engine light on instrument cluster
quickVerdict: Clear only after a repair or to see if a fault returns; clearing alone fixes nothing and can hide readiness issues.
keyTakeaways:
  - Clearing erases freeze-frame and readiness
  - Fix root cause first when driveability is affected
  - Some states fail inspection with incomplete monitors
estimatedSavings: Avoids unnecessary parts swapping
draft: false
---
```

## Body structure (all types)

1. **Direct answer** in the first screen (what it is / what to do).
2. **Symptoms / context**
3. **Step-by-step** diagnosis or comparison criteria
4. **Related codes or lights** (link to `/codes/XXXX` or `/dash-lights/slug`)
5. **Tools / parts** — one contextual affiliate block max
6. **When to see a pro**

Use headings (`##`) that match real user questions. Keep paragraphs short for mobile.

## Affiliate URL policy

- Placeholder `https://example.com/aff/REPLACE` is allowed only in drafts.
- Before `draft: false`, replace with real tracked URLs from the user’s affiliate programs.
- Never use competitor brand links as “affiliate” without a real partnership.

## Workflow for agents

1. Read `velite.config.ts` for the target collection schema.
2. Pick path + slug; ensure slug is unique.
3. Write MDX with complete frontmatter.
4. Add/choose cover image under `content/assets/covers/` (or project convention).
5. Run `npx velite build` (or `npm run build`) and fix schema errors.
6. Wire internal links to codes/dash-lights that exist in collections.

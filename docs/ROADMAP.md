# PIT.CODES — Phased roadmap (launch foundation)

Primary goal: **top 20 OBD codes fully enriched** + **dash-light gallery with lit/glow SVGs and full detail pages**, then deploy.

---

## Phase A — Local content pipeline (you run these)

### A1. Install & env

```bash
cd pitcodes
npm install
cp .env.example .env.local   # if present; set NEXT_PUBLIC_SITE_URL=https://pit.codes
```

### A2. Seed top 20 enriched codes

Seed file: `content/code-db/top20-enriched.json`  
Writer: `lib/scripts/seed-top20.mjs`

```bash
npm run codes:seed-top20
# or force overwrite:
node lib/scripts/seed-top20.mjs --force
```

Verify:

```bash
ls content/codes/P0*.json | head
node -e "const c=require('./content/codes/P0420.json'); console.log(c.enriched, c.searchPriority, c.faq?.length)"
```

Optional full library (placeholders, not enriched):

```bash
npm run codes:split              # all codes from raw-codes.json
npm run codes:split -- --limit 100
```

### A3. Dash icons + SVGs (your art)

1. Place **currentColor** SVGs at:
   `content/dashboard-icons/svg/{id}.svg`
2. Match JSON `id` (e.g. `check-engine` → `svg/check-engine.svg`).
3. Rules for **glow**:
   - Use `fill="currentColor"` and/or `stroke="currentColor"` only
   - `viewBox` consistent (e.g. `0 0 64 64`)
   - No hardcoded red/amber fills — color comes from JSON `color` + CSS glow

```bash
npm run generate:icons
```

JSON should include `glow: true` (default in schema) and optional `searchPriority`.

### A4. Build content + app

```bash
npm run content          # velite only
npm run dev              # icons prehook + Next (Velite watches via next.config)
# production:
npm run build && npm run start
```

Open:
- http://localhost:3000/codes/P0420
- http://localhost:3000/dash-lights
- http://localhost:3000/sitemap.xml

---

## Phase B — Enrichment quality (top 20)

Already seeded with `enriched: true`, FAQ, costs, related codes/lights. Improve further by editing:

`content/codes/P0420.json` (etc.)

Required fields for SEO money pages:
- `title`, `description`, `focusKeyword`
- `symptoms`, `causes`, `solutions` (specific, not generic)
- `faq` (2–4 items)
- `estimatedCost`, `relatedCodes`, `relatedDashLights`
- `searchPriority` 1–20
- `stopDriving` / `urgencyNote` where relevant
- `affiliateProducts[].url` → real Amazon tracked links when ready

After edits:

```bash
npm run content
```

---

## Phase C — SVG delivery checklist (dash lights)

Priority icons (draw first):

| id | color | severity |
|----|-------|----------|
| check-engine | amber | warning |
| oil-pressure | red | critical |
| battery-charge | red | critical |
| abs | amber | warning |
| airbag | red | critical |
| tpms | amber | warning |
| coolant-temp | red | critical |
| brake | red | critical |
| traction | amber | warning |
| oil-level | amber | warning |

Test glow on `/dash-lights` and `/dash-lights/check-engine`.

---

## Phase D — Deploy

1. Push `main` to GitHub.
2. Vercel (or host) → import `jeepmeta/pitcodes`.
3. Env: `NEXT_PUBLIC_SITE_URL=https://pit.codes`
4. Build command: `npm run build` (runs icons + Velite via Next config).
5. After deploy: Google Search Console → property → submit `https://pit.codes/sitemap.xml`.

---

## Phase E — After launch (SEO / money)

1. Wire Amazon URLs into `affiliateProducts` on top 20 codes + key lights.
2. Add 1–2 MDX guides using `.agents/skills/articles` examples.
3. JSON-LD is available via `lib/seo/json-ld.tsx` — ensure code/detail pages import `JsonLd` (add if not present on a page).
4. Expand enrichment beyond top 20 only with quality gates.

---

## npm scripts reference

| Script | Purpose |
|--------|--------|
| `npm run codes:seed-top20` | Top 20 enriched → `content/codes` |
| `npm run codes:split` | Full raw dump → per-code JSON |
| `npm run generate:icons` | Validate icons / placeholder SVG |
| `npm run content` | `velite build --clean` |
| `npm run dev` / `build` | Next + Velite integration |

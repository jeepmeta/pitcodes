# Velite content pipeline

## Flow

```
content/code-db/raw-codes.json  ──npm run codes:split──►  content/codes/*.json
content/dashboard-icons/*.json  ──npm run generate:icons─► svg paths + placeholders
        │
        ▼
  next dev / next build  (next.config.ts starts Velite once)
        │
        ▼
     .velite/   +   public/static/
        │
        ▼
  app routes import via #site/content or lib/content.ts
```

## Scripts

| Command | Role |
|---------|------|
| `npm run content` | One-shot `velite build --clean` |
| `npm run content:watch` | Velite only (optional; Next already watches in dev) |
| `npm run codes:split` | Raw OBD dump → per-code JSON for Velite |
| `npm run generate:icons` | Validate dash icons; placeholder SVG if art missing |
| `npm run dev` / `build` | Icons prehook → Next → Velite via `next.config.ts` |

## Why Velite runs inside Next

Turbopack-friendly pattern from Velite docs: start `velite.build({ watch })` once from `next.config.ts` so you do not double-run Velite in npm scripts and watch works in dev.

## Schema notes

- OBD codes: `^[PCBU]\\d{4}$` (not BCCP).
- Codes collection: `content/codes/**/*.json` only — not the giant raw file.
- Draft MDX is stripped in `prepare` before write.
- Production: `strict: true` + `output.clean: true`.

## First-time local setup

```bash
npm install
npm run codes:split          # or --limit 100 while iterating
npm run generate:icons
npm run dev
```

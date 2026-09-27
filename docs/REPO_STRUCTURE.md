# Target repository structure

```tree
pitcodes/
├── VISION.md
├── README.md
├── AGENTS.md
├── velite.config.ts
├── .agents/skills/
│   ├── velite/
│   ├── articles/
│   └── monetization/
├── content/
│   ├── code-db/raw-codes.json
│   ├── codes/                 # per-code JSON
│   ├── dashboard-icons/       # JSON + svg/
│   ├── articles/
│   │   ├── comparisons/
│   │   ├── codes/
│   │   ├── products/
│   │   ├── troubleshooting/
│   │   └── decisions/
│   └── site/
├── app/
│   ├── codes/
│   ├── dash-lights/
│   ├── guides/[slug]/
│   ├── reviews/[slug]/
│   └── articles/
├── components/
│   ├── layout/
│   ├── mdx/
│   ├── monetization/
│   ├── codes/
│   ├── dash-lights/
│   └── ui/
└── lib/scripts/
```

## Schema ↔ folder map

| Collection | Pattern | Route prefix |
| ---------- | ------- | ------------ |
| `codes` | `codes/**/*.json` | `/codes/[code]` |
| `dashboardIcons` | `dashboard-icons/*.json` | `/dash-lights/[slug]` |
| `comparisons` | `articles/comparisons/*.mdx` | `/guides/[slug]` |
| `deepCodes` | `articles/codes/*.mdx` | `/codes/[code]/guide` |
| `deepProducts` | `articles/products/*.mdx` | `/reviews/[slug]` |
| `troubleshooting` | `articles/troubleshooting/*.mdx` | `/guides/[slug]` |
| `decisions` | `articles/decisions/*.mdx` | `/guides/[slug]` |

## Migration notes

1. Keep `content/dashboard-icons/*.json`; SVGs under `content/dashboard-icons/svg/`.
2. Generate `content/codes/*.json` from `content/code-db/raw-codes.json`.
3. Create `content/articles/*` dirs before first MDX.
4. Replace empty `app/**/page.tsx` stubs with `.velite` readers.
5. Complete articles + monetization skills before bulk MDX generation.

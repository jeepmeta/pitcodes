# Per-code OBD JSON

One file per code: `P0300.json`, `C0035.json`, etc.

Generate from `../code-db/raw-codes.json` via `lib/scripts/` — do not hand-maintain thousands of files without a generator.

Must match Velite collection `codes` in `velite.config.ts`.

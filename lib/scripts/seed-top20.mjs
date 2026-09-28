#!/usr/bin/env node
/**
 * Write content/code-db/top20-enriched.json → content/codes/{CODE}.json
 * Usage: npm run codes:seed-top20
 *        node lib/scripts/seed-top20.mjs --force
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SEED = path.join(ROOT, 'content/code-db/top20-enriched.json')
const OUT = path.join(ROOT, 'content/codes')
const force = process.argv.includes('--force')

function main() {
  if (!fs.existsSync(SEED)) {
    console.error('[seed-top20] Missing', SEED)
    process.exit(1)
  }
  const list = JSON.parse(fs.readFileSync(SEED, 'utf8'))
  if (!Array.isArray(list)) {
    console.error('[seed-top20] Seed must be an array')
    process.exit(1)
  }
  fs.mkdirSync(OUT, { recursive: true })
  let written = 0
  let skipped = 0
  for (const row of list) {
    const code = String(row.code || '').toUpperCase()
    if (!/^[PCBU]\d{4}$/.test(code)) continue
    const dest = path.join(OUT, `${code}.json`)
    if (!force && fs.existsSync(dest)) {
      try {
        const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
        if (existing.enriched === true) {
          skipped++
          continue
        }
      } catch {}
    }
    const record = { ...row, code, enriched: true }
    fs.writeFileSync(dest, JSON.stringify(record, null, 2) + '\n', 'utf8')
    written++
  }
  console.log(`[seed-top20] written=${written} skipped=${skipped}`)
}

main()

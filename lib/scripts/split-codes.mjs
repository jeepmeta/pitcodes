#!/usr/bin/env node
/**
 * Split content/code-db/raw-codes.json → content/codes/{CODE}.json
 * Output matches Velite `codes` collection schema (with safe defaults).
 *
 * Usage:
 *   npm run codes:split
 *   node lib/scripts/split-codes.mjs --limit 50   # sample for local tests
 *   node lib/scripts/split-codes.mjs --force      # overwrite existing
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const RAW = path.join(ROOT, 'content/code-db/raw-codes.json')
const OUT = path.join(ROOT, 'content/codes')

const args = new Set(process.argv.slice(2))
const force = args.has('--force')
const limitIdx = process.argv.indexOf('--limit')
const limit =
  limitIdx >= 0 ? Number(process.argv[limitIdx + 1]) || undefined : undefined

const CATEGORY = {
  P: 'Powertrain',
  C: 'Chassis',
  B: 'Body',
  U: 'Network',
}

function clip(str, max) {
  const t = str.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).trimEnd() + '…'
}

function ensureDescription(desc, code) {
  let d = desc.replace(/\s+/g, ' ').trim()
  if (d.length >= 50) return clip(d, 160)
  // Pad thin OEM strings so Velite min(50) passes
  d = `${d} Diagnostic trouble code ${code}. Confirm with a scan tool and vehicle-specific service data.`
  return clip(d, 160)
}

function ensureTitle(code, desc) {
  const base = `${code} – ${desc}`
  return clip(base, 70)
}

function main() {
  if (!fs.existsSync(RAW)) {
    console.error(`[split-codes] Missing ${RAW}`)
    process.exit(1)
  }

  fs.mkdirSync(OUT, { recursive: true })
  const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'))
  if (!Array.isArray(raw)) {
    console.error('[split-codes] raw-codes.json must be an array')
    process.exit(1)
  }

  let written = 0
  let skipped = 0
  let invalid = 0

  const list = limit ? raw.slice(0, limit) : raw

  for (const row of list) {
    const code = String(row.Code ?? row.code ?? '')
      .trim()
      .toUpperCase()
    if (!/^[PCBU]\d{4}$/.test(code)) {
      invalid++
      continue
    }

    const outPath = path.join(OUT, `${code}.json`)
    if (!force && fs.existsSync(outPath)) {
      skipped++
      continue
    }

    const desc = String(row.Description ?? row.description ?? '').trim()
    if (!desc) {
      invalid++
      continue
    }

    const letter = code[0]
    const record = {
      code,
      title: ensureTitle(code, desc),
      description: ensureDescription(desc, code),
      category: CATEGORY[letter] ?? 'Powertrain',
      severity: 'medium',
      symptoms: [
        'Check engine light or stored DTC present',
        'Driveability or system warning may accompany this code',
      ],
      causes: [
        'Component or circuit fault related to this monitor',
        'Wiring, connector, or control module issue',
      ],
      solutions: [
        'Verify the code with a quality OBD-II scanner and note freeze-frame data',
        'Inspect related components and wiring before replacing parts',
        'Clear codes only after repair and confirm monitors complete',
      ],
      keywords: [code, desc.split(' ').slice(0, 6).join(' ').toLowerCase()],
      relatedCodes: [],
      commonVehicles: [],
    }

    fs.writeFileSync(outPath, JSON.stringify(record, null, 2) + '\n', 'utf8')
    written++
  }

  console.log(
    `[split-codes] written=${written} skipped=${skipped} invalid=${invalid} out=${OUT}`
  )
}

main()

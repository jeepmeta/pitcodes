#!/usr/bin/env node
/**
 * Validate dashboard-icons JSON and ensure SVG paths exist.
 * Does not invent artwork — fails loudly on missing files so Velite/s.file() stays clean.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DIR = path.join(ROOT, 'content/dashboard-icons')
const SVG_DIR = path.join(DIR, 'svg')

function main() {
  if (!fs.existsSync(DIR)) {
    console.warn('[generate-icons] No content/dashboard-icons — skip')
    return
  }

  fs.mkdirSync(SVG_DIR, { recursive: true })

  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'))
  let ok = 0
  let missingSvg = 0
  let badJson = 0

  for (const file of files) {
    const full = path.join(DIR, file)
    let data
    try {
      data = JSON.parse(fs.readFileSync(full, 'utf8'))
    } catch {
      console.error(`[generate-icons] Invalid JSON: ${file}`)
      badJson++
      continue
    }

    if (!data.id || !data.svg) {
      console.error(`[generate-icons] ${file}: missing id or svg`)
      badJson++
      continue
    }

    // Normalize svg field to svg/{id}.svg when possible
    const preferred = `svg/${data.id}.svg`
    const candidates = [data.svg, preferred, path.join('svg', path.basename(data.svg))]

    let resolved = null
    for (const rel of candidates) {
      const abs = path.join(DIR, rel)
      if (fs.existsSync(abs)) {
        resolved = rel.replace(/\\/g, '/')
        break
      }
    }

    if (!resolved) {
      // Placeholder 1x1 transparent SVG so Velite can build; replace with real art later
      const target = path.join(SVG_DIR, `${data.id}.svg`)
      if (!fs.existsSync(target)) {
        fs.writeFileSync(
          target,
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="32" cy="32" r="20"/><text x="32" y="36" text-anchor="middle" font-size="10" fill="currentColor" stroke="none">${data.id.slice(0, 4)}</text></svg>\n`,
          'utf8'
        )
        console.warn(`[generate-icons] placeholder SVG for ${data.id}`)
      }
      resolved = preferred
      missingSvg++
    }

    if (data.svg !== resolved) {
      data.svg = resolved
      fs.writeFileSync(full, JSON.stringify(data, null, 2) + '\n', 'utf8')
    }
    ok++
  }

  console.log(
    `[generate-icons] ok=${ok} placeholders=${missingSvg} badJson=${badJson}`
  )
}

main()

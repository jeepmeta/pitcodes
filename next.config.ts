import type { NextConfig } from 'next'

/**
 * Start Velite once per Next process (Turbopack-safe).
 * Dev: watch content tree. Build: clean generate then Next.
 * @see .agents/skills/velite/references/with-nextjs.md
 */
const isDev = process.argv.includes('dev')
const isBuild = process.argv.includes('build')
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1'
  const { build } = await import('velite')
  await build({ watch: isDev, clean: !isDev })
}

const nextConfig: NextConfig = {
  // Avoid bundling issues with generated content imports
  serverExternalPackages: [],
}

export default nextConfig

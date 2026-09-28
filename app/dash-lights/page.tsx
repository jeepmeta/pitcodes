import type { Metadata } from 'next'
import Link from 'next/link'
import { getDashboardIcons } from '@/lib/content'
import { GlowIcon } from '@/components/dash-lights/GlowIcon'

export const metadata: Metadata = {
  title: 'Dashboard Warning Lights',
  description:
    'Identify dashboard warning lights. Select the symbol that matches your cluster.',
  alternates: { canonical: '/dash-lights' },
}

function svgSrc(svg?: string) {
  if (!svg) return undefined
  if (svg.startsWith('http') || svg.startsWith('/')) return svg
  return `/${svg}`
}

export default async function DashLightsGalleryPage() {
  const icons = await getDashboardIcons()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard warning lights
        </h1>
        <p className="mt-2 text-zinc-400">
          Tap the symbol that looks like the one on your instrument cluster.
        </p>
      </header>

      {icons.length === 0 ? (
        <p className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
          Icon data not built yet. Add SVGs under{' '}
          <code className="text-orange-300">content/dashboard-icons/svg/</code>, run{' '}
          <code className="text-orange-300">npm run generate:icons</code>, then{' '}
          <code className="text-orange-300">npm run dev</code>.
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {icons.map((icon) => (
            <li key={icon.id}>
              <Link
                href={icon.permalink ?? `/dash-lights/${icon.id}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 bg-black/40 p-3 transition hover:border-zinc-600 hover:bg-zinc-900"
              >
                <GlowIcon
                  src={svgSrc(icon.svg)}
                  color={icon.color}
                  name={icon.name}
                  size={40}
                  glow={icon.glow !== false}
                />
                <span className="line-clamp-2 text-center text-xs font-medium text-zinc-300">
                  {icon.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

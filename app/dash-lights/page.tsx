import type { Metadata } from 'next'
import Link from 'next/link'
import { getDashboardIcons } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Dashboard Warning Lights',
  description:
    'Identify dashboard warning lights. Select the symbol that matches your cluster.',
  alternates: { canonical: '/dash-lights' },
}

const severityOrder = { critical: 0, warning: 1, info: 2 } as const

const colorClass: Record<string, string> = {
  red: 'text-red-400',
  amber: 'text-amber-400',
  green: 'text-emerald-400',
  blue: 'text-blue-400',
  white: 'text-zinc-200',
}

export default async function DashLightsGalleryPage() {
  const icons = (await getDashboardIcons()).slice().sort(
    (a, b) =>
      severityOrder[a.severity] - severityOrder[b.severity] ||
      a.name.localeCompare(b.name)
  )

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
          Icon data not built yet. Run{' '}
          <code className="text-orange-300">npm run generate:icons</code> and
          Velite, then refresh.
        </p>
      ) : (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {icons.map((icon) => (
            <li key={icon.id}>
              <Link
                href={`/dash-lights/${icon.id}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 p-3 transition hover:border-zinc-600 hover:bg-zinc-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={icon.svg?.startsWith('/') ? icon.svg : `/${icon.svg ?? ''}`}
                  alt=""
                  width={40}
                  height={40}
                  className={`h-10 w-10 ${colorClass[icon.color] ?? ''}`}
                  aria-hidden
                />
                <span className="line-clamp-2 text-center text-xs font-medium text-zinc-300">
                  {icon.name}
                </span>
                <span className="sr-only">
                  {icon.severity} {icon.color} — {icon.definition}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

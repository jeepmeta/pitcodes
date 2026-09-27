import type { Metadata } from 'next'
import Link from 'next/link'
import { getCodes } from '@/lib/content'
import { SeverityBadge } from '@/components/ui/severity-badge'
import { CodesSearch } from '@/components/codes/CodesSearch'

export const metadata: Metadata = {
  title: 'OBD-II Trouble Codes',
  description:
    'Browse and search OBD-II diagnostic trouble codes. Symptoms, causes, and fixes.',
  alternates: { canonical: '/codes' },
}

export default async function CodesIndexPage() {
  const codes = await getCodes()
  const sample = codes.slice(0, 40)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          OBD-II codes
        </h1>
        <p className="mt-2 text-zinc-400">
          Enter the code from your scanner (for example P0300). We show what it
          means and what to check next.
        </p>
      </header>

      <CodesSearch />

      {sample.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            In the database ({codes.length})
          </h2>
          <ul className="divide-y divide-zinc-900 rounded-xl border border-zinc-800">
            {sample.map((c) => (
              <li key={c.code}>
                <Link
                  href={`/codes/${c.code.toUpperCase()}`}
                  className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-zinc-900/80"
                >
                  <div>
                    <span className="font-mono font-semibold text-orange-400">
                      {c.code.toUpperCase()}
                    </span>
                    <p className="mt-0.5 text-sm text-zinc-400 line-clamp-1">
                      {c.title}
                    </p>
                  </div>
                  <SeverityBadge severity={c.severity} className="shrink-0">
                    {c.severity}
                  </SeverityBadge>
                </Link>
              </li>
            ))}
          </ul>
          {codes.length > sample.length ? (
            <p className="mt-3 text-sm text-zinc-500">
              Showing {sample.length} of {codes.length}. Use search for a specific
              code.
            </p>
          ) : null}
        </section>
      ) : (
        <p className="mt-10 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
          Code data is not built yet. Run the Velite/code pipeline (`npm run build`
          or your populate script), then refresh. You can still open known codes
          like{' '}
          <Link href="/codes/P0300" className="text-orange-400 hover:underline">
            P0300
          </Link>
          .
        </p>
      )}
    </div>
  )
}

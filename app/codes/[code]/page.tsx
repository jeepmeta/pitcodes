import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCode, getCodes } from '@/lib/content'
import { SeverityBadge } from '@/components/ui/severity-badge'
import { AdSlot } from '@/components/monetization/AdSlot'

type Props = { params: Promise<{ code: string }> }

export async function generateStaticParams() {
  const codes = await getCodes()
  return codes.map((c) => ({ code: c.code.toUpperCase() }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const entry = await getCode(code)
  if (!entry) {
    return {
      title: `${code.toUpperCase()} — OBD code`,
      description: `Information about OBD-II code ${code.toUpperCase()}.`,
    }
  }
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: entry.canonical ?? `/codes/${entry.code.toUpperCase()}` },
  }
}

export default async function CodeDetailPage({ params }: Props) {
  const { code: raw } = await params
  const code = raw.toUpperCase()
  const entry = await getCode(code)

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="font-mono text-sm text-orange-500">{code}</p>
        <h1 className="mt-1 text-2xl font-bold">Code not in database yet</h1>
        <p className="mt-3 text-zinc-400">
          We do not have a full entry for {code}. Populate codes via the Velite
          pipeline, or check the format (letter + four digits).
        </p>
        <Link
          href="/codes"
          className="mt-6 inline-block text-sm text-orange-400 hover:underline"
        >
          ← All codes
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/codes" className="hover:text-zinc-300">
          ← Codes
        </Link>
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge severity={entry.severity}>{entry.severity}</SeverityBadge>
          <span className="rounded-md border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
            {entry.category}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="font-mono text-orange-400">{entry.code.toUpperCase()}</span>
          <span className="text-zinc-500"> — </span>
          {entry.title.replace(new RegExp(`^${entry.code}\\s*[–-]\\s*`, 'i'), '')}
        </h1>
        <p className="text-zinc-400 leading-relaxed">{entry.description}</p>
      </header>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section className="rounded-xl border border-zinc-800 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Symptoms
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-300">
            {entry.symptoms.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-zinc-800 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Common causes
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-300">
            {entry.causes.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-zinc-800 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          What to do
        </h2>
        <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-zinc-300">
          {entry.solutions.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      {entry.estimatedCost ? (
        <p className="mt-4 text-sm text-zinc-500">
          Typical repair range:{' '}
          <span className="text-zinc-300">
            {entry.estimatedCost.currency} {entry.estimatedCost.min}–
            {entry.estimatedCost.max}
          </span>{' '}
          (parts/labor vary by vehicle)
        </p>
      ) : null}

      <AdSlot slotId="code-after-content" placement="after-content" />
    </div>
  )
}

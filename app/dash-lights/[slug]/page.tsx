import type { Metadata } from 'next'
import Link from 'next/link'
import { getDashboardIcon, getDashboardIcons } from '@/lib/content'
import { AdSlot } from '@/components/monetization/AdSlot'
import { AffiliateCallout } from '@/components/monetization/AffiliateCallout'
import { GlowIcon } from '@/components/dash-lights/GlowIcon'
import { JsonLd, techArticleLd, faqPageLd } from '@/lib/seo/json-ld'

type Props = { params: Promise<{ slug: string }> }

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pit.codes'

const severityClass: Record<string, string> = {
  critical: 'bg-red-500/15 text-red-400',
  warning: 'bg-amber-500/15 text-amber-400',
  info: 'bg-zinc-500/15 text-zinc-300',
}

function svgSrc(svg?: string) {
  if (!svg) return undefined
  if (svg.startsWith('http') || svg.startsWith('/')) return svg
  return `/${svg}`
}

export async function generateStaticParams() {
  const icons = await getDashboardIcons()
  return icons.map((i) => ({ slug: i.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const icon = await getDashboardIcon(slug)
  if (!icon) return { title: 'Dash light' }
  return {
    title: `${icon.name} Dashboard Warning Light`,
    description: icon.definition.slice(0, 160),
    keywords: icon.keywords,
    alternates: { canonical: icon.canonical ?? `/dash-lights/${icon.id}` },
  }
}

export default async function DashLightDetailPage({ params }: Props) {
  const { slug } = await params
  const icon = await getDashboardIcon(slug)

  if (!icon) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Light not found</h1>
        <Link href="/dash-lights" className="mt-4 inline-block text-orange-400">
          ← All dash lights
        </Link>
      </div>
    )
  }

  const url = `${SITE}/dash-lights/${icon.id}`
  const ld = [
    techArticleLd({
      title: `${icon.name} Dashboard Warning Light`,
      description: icon.definition,
      url,
    }),
  ]
  const faqLd = icon.faq?.length ? faqPageLd(url, icon.faq) : null
  if (faqLd) ld.push(faqLd)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={ld} />
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/dash-lights" className="hover:text-zinc-300">
          ← Dash lights
        </Link>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-black">
          <GlowIcon
            src={svgSrc(icon.svg)}
            color={icon.color}
            name={icon.name}
            size={64}
            glow={icon.glow !== false}
          />
        </div>
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${severityClass[icon.severity]}`}
            >
              {icon.severity}
            </span>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-300">
              {icon.color}
            </span>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs capitalize text-zinc-300">
              {icon.category}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{icon.name}</h1>
          <p className="mt-2 text-zinc-400 leading-relaxed">{icon.definition}</p>
          {icon.urgencyNote ? (
            <p
              className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
                icon.stopDriving
                  ? 'border-red-500/40 bg-red-500/10 text-red-300'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300'
              }`}
            >
              {icon.stopDriving ? 'Stop driving: ' : ''}
              {icon.urgencyNote}
            </p>
          ) : null}
        </div>
      </header>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <section className="rounded-xl border border-zinc-800 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Common causes
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-300">
            {icon.causes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-zinc-800 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            What to do
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-zinc-300">
            {icon.solutions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </section>
      </div>

      {icon.relatedObdCodes.length > 0 ? (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Related OBD codes
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {icon.relatedObdCodes.map((c) => (
              <li key={c}>
                <Link
                  href={`/codes/${c.toUpperCase()}`}
                  className="rounded-md bg-zinc-900 px-2 py-1 font-mono text-sm text-orange-400 hover:bg-zinc-800"
                >
                  {c.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {icon.faq && icon.faq.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">FAQ</h2>
          <dl className="mt-3 space-y-4">
            {icon.faq.map((f) => (
              <div key={f.question} className="rounded-xl border border-zinc-800 p-4">
                <dt className="font-medium text-zinc-100">{f.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-zinc-400">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {icon.affiliateProducts
        ?.filter((p) => p.url)
        .map((p) => (
          <AffiliateCallout key={p.name} title={p.name} href={p.url} blurb={p.blurb} />
        ))}

      <AdSlot slotId="dash-after-content" placement="after-content" />
    </div>
  )
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-16">
      <section className="space-y-4 text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-widest text-orange-500">
          PIT.CODES
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          OBD codes and dash lights, without the runaround
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Look up the code on your scanner or the symbol on your cluster. Get
          what it means, what to check, and what to do next — fast, on your
          phone.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/codes"
          className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-orange-600/50 hover:bg-zinc-900"
        >
          <h2 className="text-lg font-semibold group-hover:text-orange-400">
            OBD-II codes
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Search P0xxx, C0xxx, B0xxx, U0xxx. Symptoms, causes, fixes, and
            related parts.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-orange-500">
            Browse codes →
          </span>
        </Link>

        <Link
          href="/dash-lights"
          className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-orange-600/50 hover:bg-zinc-900"
        >
          <h2 className="text-lg font-semibold group-hover:text-orange-400">
            Dashboard lights
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Match the icon on your instrument cluster. Severity, causes, and
            what to do.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-orange-500">
            Identify a light →
          </span>
        </Link>
      </section>

      <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Popular starting points
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {['P0300', 'P0420', 'P0171', 'P0455', 'P0128'].map((code) => (
            <li key={code}>
              <Link
                href={`/codes/${code}`}
                className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-mono text-sm text-zinc-200 hover:border-orange-600/40 hover:text-white"
              >
                {code}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/dash-lights/check-engine"
              className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 hover:border-orange-600/40 hover:text-white"
            >
              Check engine
            </Link>
          </li>
          <li>
            <Link
              href="/dash-lights/oil-pressure"
              className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 hover:border-orange-600/40 hover:text-white"
            >
              Oil pressure
            </Link>
          </li>
        </ul>
      </section>

      <section className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" size="lg" asChild={false}>
          <Link href="/codes" className="contents">
            Look up a code
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Link href="/dash-lights" className="contents">
            Find a dash light
          </Link>
        </Button>
      </section>
    </div>
  )
}

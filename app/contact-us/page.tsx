import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact PIT.CODES about corrections, partnerships, or feedback.',
  robots: { index: true, follow: true },
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Contact</h1>
      <p className="mt-3 max-w-xl text-zinc-400 leading-relaxed">
        Found a wrong definition, missing code, or partnership idea? Email{' '}
        <a
          href="mailto:hello@pit.codes"
          className="text-orange-400 hover:underline"
        >
          hello@pit.codes
        </a>
        . We read every message; technical corrections get priority.
      </p>
    </div>
  )
}

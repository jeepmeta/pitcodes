import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="font-medium text-zinc-300">PIT.CODES</p>
          <p className="max-w-xs leading-relaxed">
            Diagnostic reference for OBD-II codes and dashboard warning lights.
            Not a substitute for professional diagnosis.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/codes" className="hover:text-zinc-200">
            Codes
          </Link>
          <Link href="/dash-lights" className="hover:text-zinc-200">
            Dash lights
          </Link>
          <Link href="/articles" className="hover:text-zinc-200">
            Guides
          </Link>
          <Link href="/contact-us" className="hover:text-zinc-200">
            Contact
          </Link>
          <Link href="/affiliate-disclaimer" className="hover:text-zinc-200">
            Affiliate disclosure
          </Link>
        </div>
      </div>
      <div className="border-t border-zinc-900">
        <p className="mx-auto max-w-3xl px-4 py-3 text-xs text-zinc-600">
          © {new Date().getFullYear()} PIT.CODES. Some links may be affiliate
          links; we may earn a commission at no extra cost to you.
        </p>
      </div>
    </footer>
  )
}

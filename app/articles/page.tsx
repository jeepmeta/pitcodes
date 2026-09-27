import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guides & articles',
  description: 'Troubleshooting guides, scanner comparisons, and repair explainers.',
  alternates: { canonical: '/articles' },
}

export default function ArticlesIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">Guides</h1>
      <p className="mt-2 text-zinc-400">
        Long-form troubleshooting, comparisons, and reviews will list here as MDX
        ships under <code className="text-zinc-300">content/articles/</code>.
      </p>
      <ul className="mt-8 space-y-2 text-sm">
        <li>
          <Link href="/codes" className="text-orange-400 hover:underline">
            OBD code lookup
          </Link>
        </li>
        <li>
          <Link href="/dash-lights" className="text-orange-400 hover:underline">
            Dashboard lights
          </Link>
        </li>
      </ul>
    </div>
  )
}

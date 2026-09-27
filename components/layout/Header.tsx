import Link from 'next/link'

const nav = [
  { href: '/codes', label: 'Codes' },
  { href: '/dash-lights', label: 'Dash lights' },
  { href: '/articles', label: 'Guides' },
] as const

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="font-semibold tracking-tight text-white hover:text-orange-400"
        >
          PIT<span className="text-orange-500">.CODES</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

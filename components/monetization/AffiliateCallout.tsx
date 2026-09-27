import { cn } from '@/lib/utils/utils'

export function AffiliateCallout({
  title,
  href,
  blurb,
  className,
}: {
  title: string
  href: string
  blurb?: string
  className?: string
}) {
  return (
    <aside
      className={cn(
        'my-6 rounded-xl border border-orange-600/30 bg-orange-600/5 p-4',
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-orange-500/90">
        Affiliate link
      </p>
      <a
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="mt-1 block text-base font-semibold text-orange-400 hover:text-orange-300"
      >
        {title}
      </a>
      {blurb ? (
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{blurb}</p>
      ) : null}
    </aside>
  )
}

import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import { AffiliateCallout } from '@/components/monetization/AffiliateCallout'
import { AdSlot } from '@/components/monetization/AdSlot'

export const mdxComponents: MDXComponents = {
  a: ({ href, children, ...props }) => {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} className="text-orange-400 underline-offset-2 hover:underline" {...props}>
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        className="text-orange-400 underline-offset-2 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  },
  h2: (props) => (
    <h2 className="mt-10 mb-3 text-xl font-semibold tracking-tight" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-6 mb-2 text-lg font-semibold" {...props} />
  ),
  p: (props) => (
    <p className="mb-4 text-base leading-relaxed text-zinc-300" {...props} />
  ),
  ul: (props) => (
    <ul className="mb-4 list-disc space-y-1 pl-5 text-zinc-300" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-4 list-decimal space-y-1 pl-5 text-zinc-300" {...props} />
  ),
  code: (props) => (
    <code
      className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[0.9em] text-orange-200"
      {...props}
    />
  ),
  AffiliateCallout,
  AdSlot,
}

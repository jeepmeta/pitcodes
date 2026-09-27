import { AffiliateCallout } from './AffiliateCallout'

export type ProductItem = {
  title: string
  href: string
  blurb?: string
}

/** Max 4 related products — keep pages useful, not a mall. */
export function ProductGrid({ products }: { products: ProductItem[] }) {
  const list = products.slice(0, 4)
  if (list.length === 0) return null

  return (
    <div className="my-8 grid gap-3 sm:grid-cols-2">
      {list.map((p) => (
        <AffiliateCallout
          key={p.href + p.title}
          title={p.title}
          href={p.href}
          blurb={p.blurb}
          className="my-0"
        />
      ))}
    </div>
  )
}

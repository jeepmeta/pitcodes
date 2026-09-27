import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate disclosure',
  description:
    'How PIT.CODES uses affiliate links and advertising — transparent disclosure.',
  robots: { index: true, follow: true },
}

export default function AffiliateDisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 prose-invert">
      <h1 className="text-2xl font-bold tracking-tight">Affiliate disclosure</h1>
      <div className="mt-4 space-y-4 text-zinc-300 leading-relaxed">
        <p>
          PIT.CODES participates in affiliate programs. That means when you click
          certain product links and buy something, we may earn a commission at no
          extra cost to you.
        </p>
        <p>
          We only recommend tools and parts that are relevant to the diagnosis on
          the page (scanners, sensors, fluids, etc.). Editorial explanations of
          codes and warning lights are not paid placements.
        </p>
        <p>
          Ads, when shown, appear in labeled slots and are separate from affiliate
          product callouts.
        </p>
      </div>
    </div>
  )
}

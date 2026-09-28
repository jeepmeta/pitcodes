/** Render JSON-LD script tags for code / dash / article pages */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const payload = Array.isArray(data) ? data : [data]
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload.length === 1 ? payload[0] : payload),
      }}
    />
  )
}

export function techArticleLd(opts: {
  title: string
  description: string
  url: string
  dateModified?: string
  datePublished?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    dateModified: opts.dateModified,
    datePublished: opts.datePublished,
    author: {
      '@type': 'Organization',
      name: 'PIT.CODES',
    },
  }
}

export function faqPageLd(
  url: string,
  faqs: { question: string; answer: string }[]
) {
  if (!faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
    url,
  }
}

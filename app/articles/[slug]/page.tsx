import Link from 'next/link'

type Props = { params: Promise<{ slug: string }> }

export default async function ArticleSlugPage({ params }: Props) {
  const { slug } = await params
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Article not published</h1>
      <p className="mt-2 text-zinc-400">
        No MDX entry for <code className="text-zinc-300">{slug}</code> yet.
      </p>
      <Link href="/articles" className="mt-6 inline-block text-orange-400">
        ← Guides
      </Link>
    </div>
  )
}

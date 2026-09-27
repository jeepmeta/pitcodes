import { mdxComponents } from './MdxComponents'

type MdxContentProps = {
  /** Velite MDX compiled code runner, if present */
  code?: React.ComponentType<{ components?: typeof mdxComponents }>
  /** Fallback HTML string from markdown collections */
  html?: string
}

export function MdxContent({ code: Code, html }: MdxContentProps) {
  if (Code) {
    return (
      <div className="mdx-content">
        <Code components={mdxComponents} />
      </div>
    )
  }
  if (html) {
    return (
      <div
        className="mdx-content prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return null
}

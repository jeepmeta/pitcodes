# Velite Collections and SEO

Use this skill when you need to model content collections in Velite, generate typed content from Markdown/MDX, and optimize that content for SEO and static site generation.

## What Velite is for

Velite turns content files into a type-safe data layer. It validates frontmatter and body data with Zod, extracts metadata from Markdown/MDX, processes local images/files, and emits JSON + TypeScript output that your app can consume with confidence.

Core ideas from the project docs:
- Put content under a top-level `content/` directory.
- Define one or more collections in `velite.config.*`.
- Each collection has a `pattern`, a `schema`, and usually a `name`.
- Use the extended `s` schema helpers for slugs, date parsing, assets, metadata, excerpt, HTML conversion, and MDX rendering.
- Output is generated to `.velite`, and assets are published to a public static directory.

## Recommended setup

1. Create a content structure like:

```diff
content/
├── posts/
│   ├── hello-world.md
│   └── seo-guide.mdx
├── authors/
│   └── jane-doe.yml
├── site/
│   └── index.yml
```

2. Define a config with `defineConfig` and `s`:

```ts
import { defineConfig, s } from 'velite'

export default defineConfig({
  root: 'content',
  strict: true,
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    clean: false
  },
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/**/*.{md,mdx}',
      schema: s.object({
        title: s.string().min(1).max(120),
        slug: s.slug('posts', ['admin', 'login']),
        date: s.isodate(),
        description: s.string().max(200).optional(),
        cover: s.image().optional(),
        excerpt: s.excerpt({ length: 180 }),
        metadata: s.metadata(),
        content: s.markdown(),
        canonical: s.string().url().optional(),
        tags: s.array(s.string()).default([])
      }).transform(data => ({
        ...data,
        permalink: `/posts/${data.slug}`
      }))
    },
    site: {
      pattern: 'site/index.yml',
      single: true,
      schema: s.object({
        title: s.string(),
        description: s.string(),
        url: s.string().url(),
        defaultImage: s.image().optional()
      })
    }
  }
})
```

3. Use `velite build` or `velite dev` during development to generate the data layer.

## Collection design rules

- Prefer one collection per content type: `posts`, `authors`, `tags`, `pages`, `docs`, etc.
- Use `single: true` for singleton config/content like site metadata.
- Use descriptive `name` values for generated TypeScript types.
- Keep the schema explicit, not too loose. Validation should catch bad slugs, missing required fields, invalid dates, and missing files.
- Use `s.slug()` for URL-safe identifiers, not raw strings from titles.
- Use `s.isodate()` to normalize date strings into ISO timestamps.
- Add computed fields with `.transform()` when you need `permalink`, `readingTime`, or SEO URL values derived from other fields.
- Use `context()` inside custom transforms when the data needs current file metadata.

## SEO-focused field patterns

Use these patterns to produce high-quality SEO data from markdown content:

- `title`: main H1 / page title
- `slug`: stable URL segment, unique within collection
- `description`: optional short summary; keep it human-readable and valuable
- `excerpt`: short snippet from body content with `s.excerpt({ length: ... })`
- `metadata`: reading time and word count via `s.metadata()`
- `content`: rendered HTML via `s.markdown()` or compiled output via `s.mdx()`
- `cover`: local hero image via `s.image()` for OG/share previews
- `canonical`: optional canonical URL override
- `tags`: taxonomy for filtering, topic pages, and internal linking

For richer content models, add custom schemas using `defineSchema` and `context()` to derive `lastModified`, page paths, or other SEO data.

## SEO implementation patterns

### 1. Generate indexable page data

`title`, `description`, `excerpt`, and `content` should be part of every content collection. These become the values used in page metadata, JSON-LD, or list pages.

```ts
schema: s.object({
  title: s.string(),
  description: s.string().max(200).optional(),
  excerpt: s.excerpt({ length: 160 }),
  content: s.markdown(),
  slug: s.slug('posts')
}).transform(post => ({
  ...post,
  permalink: `/posts/${post.slug}`
}))
```

### 2. Use Markdown/MDX for semantic content

Markdown is portable and simple; MDX is useful when you want embedded components or richer layouts.

- Prefer `s.markdown()` for most article pages and SEO content.
- Use `s.mdx()` for doc pages or interactive content where compiled components are needed.
- Add `remarkPlugins` and `rehypePlugins` in config when you need syntax highlighting, heading transforms, or other content processing.

### 3. Optimize asset handling

Use `s.file()` and `s.image()` so static files and images are copied to the public directory and referenced by generated URLs.

This is especially useful for:
- article hero images
- OG/share images
- downloadable PDFs or assets
- internal content references

### 4. Add metadata for search and UX

Use `s.metadata()` and `s.excerpt()` to feed metadata cards, summary pages, and lists. These values help with rich snippets, page previews, and fast list rendering.

### 5. Generate static routes from collections

When integrating with Next.js, emit stable URLs from the collection data and use generated static params:

```ts
import { posts } from '.velite'

export function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }))
}
```

Use the same values to generate metadata in app routes:

```ts
export function generateMetadata({ params }) {
  const post = posts.find(item => item.slug === params.slug)
  return {
    title: post?.title,
    description: post?.description ?? post?.excerpt
  }
}
```

## Recommended Velite conventions for SEO

- Keep slugs unique and reserved-word-safe.
- Normalize content dates with `s.isodate()`.
- Derive canonical routes from `slug` and collection context.
- Keep `description` and `excerpt` distinct but aligned.
- Use `.transform()` to add `permalink`, `canonical`, `contentType`, or `ogImage` fields.
- Mark content as clean and consistent with `strict: true` in production.
- Put generated data in `.velite` and static assets in `public/static` so they can be served and cached effectively.

## Example: blog collection with SEO fields

```ts
import { defineConfig, s } from 'velite'

export default defineConfig({
  root: 'content',
  strict: true,
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/**/*.md',
      schema: s.object({
        title: s.string().min(1).max(120),
        slug: s.slug('posts', ['api', 'admin']),
        date: s.isodate(),
        description: s.string().max(200).optional(),
        cover: s.image().optional(),
        excerpt: s.excerpt({ length: 180 }),
        metadata: s.metadata(),
        content: s.markdown({
          gfm: true,
          removeComments: true,
          copyLinkedFiles: true
        }),
        tags: s.array(s.string()).default([])
      }).transform(post => ({
        ...post,
        permalink: `/posts/${post.slug}`,
        ogImage: post.cover?.src ?? '/og-default.jpg'
      }))
    }
  }
})
```

## Practical do/don't

Do:
- define collections at the top level of your content tree
- validate and transform content using Zod and `s`
- generate `slug`, `excerpt`, `metadata`, and `content` automatically
- use `s.image()` and `s.file()` for asset URLs
- use `strict: true` when you want build failures on schema drift

Don't:
- store unvalidated user-generated content directly without schema rules
- generate raw paths manually when `s.slug()` can enforce uniqueness
- ignore the difference between `description` and `excerpt`
- rely on ad hoc image URLs instead of `s.image()`
- build content collections without consistent top-level organization

## Internal guidance for AI agents

When building a content model with Velite:
- Start from the content shape, not the UI.
- Model each content domain as a collection.
- Add slug, metadata, excerpt, rich content, and asset fields before wiring pages.
- Prefer generated data from Velite over re-parsing Markdown in app code.
- Use Next.js integration only when you need live generation in the app pipeline.
- Treat collection output as source-of-truth structured content for SEO pages and routing.

## Reference set used

This skill is based on the Velite docs in the project reference set, especially:
- `define-collections.md`
- `using-collections.md`
- `velite-schemas.md`
- `config.md`
- `quick-start.md`
- `using-markdown.md`
- `using-mdx.md`
- `with-nextjs.md`
- `asset-handling.md`
- `custom-schema.md`
- `types.md`
- `index.md`
- `introduction.md`

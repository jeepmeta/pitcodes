import { defineCollection, defineConfig, s } from 'velite'

// ─────────────────────────────────────────────
// Shared primitives (SEO + pipeline)
// ─────────────────────────────────────────────

const seoFields = {
  title: s.string().min(10).max(70),
  description: s.string().min(50).max(160),
  /** Primary ranking phrase; used in H1 alignment and internal tooling */
  focusKeyword: s.string().max(80).optional(),
  keywords: s.array(s.string()).default([]),
  robots: s.string().default('index, follow'),
  /** Optional override for Open Graph title (defaults to title in app) */
  ogTitle: s.string().max(70).optional(),
}

const eeatFields = {
  publishedAt: s.isodate(),
  updatedAt: s.isodate().optional(),
  /** ISO date of last human/ASE-style review */
  lastReviewed: s.isodate().optional(),
  author: s.string().default('PIT.CODES Automotive Team'),
  reviewer: s.string().default('ASE Certified Master Technician'),
}

/** FAQ items → FAQPage JSON-LD */
const faqItem = s.object({
  question: s.string().min(10).max(160),
  answer: s.string().min(20).max(500),
})

/** Tracked product CTA (Amazon-first) */
const affiliateProduct = s.object({
  name: s.string().min(2).max(80),
  /** Full tracked URL; empty string allowed only when draft */
  url: s.string().url().or(s.literal('')),
  blurb: s.string().max(160).optional(),
  asin: s.string().max(16).optional(),
})

/** Official OBD-II: P|C|B|U + 4 digits */
const obdCode = s
  .string()
  .regex(/^[PCBU]\d{4}$/i, 'Invalid OBD-II code (expected P/C/B/U + 4 digits)')

const articleSlug = s.slug('articles', [
  'admin',
  'login',
  'api',
  'codes',
  'dash-lights',
  'guides',
  'reviews',
])

// ─────────────────────────────────────────────
// 1. Diagnostic codes (money pages)
// ─────────────────────────────────────────────
const codes = defineCollection({
  name: 'DiagnosticCode',
  pattern: 'codes/**/*.json',
  schema: s
    .object({
      code: obdCode,
      title: s.string().min(10).max(70),
      description: s.string().min(50).max(160),
      focusKeyword: s.string().max(80).optional(),
      category: s.enum(['Powertrain', 'Body', 'Chassis', 'Network']),
      severity: s.enum(['low', 'medium', 'high', 'critical']),
      /** 1 = highest SEO priority (top searched); omit = normal */
      searchPriority: s.number().min(1).max(100).optional(),
      /** Human-enriched vs pipeline defaults */
      enriched: s.boolean().default(false),
      /** Advise stopping / limping home */
      stopDriving: s.boolean().default(false),
      urgencyNote: s.string().max(200).optional(),
      symptoms: s.array(s.string()).min(1),
      causes: s.array(s.string()).min(1),
      /** Ordered DIY / shop steps */
      solutions: s.array(s.string()).min(1),
      estimatedCost: s
        .object({
          min: s.number().min(0),
          max: s.number().min(0),
          currency: s.string().default('USD'),
        })
        .optional(),
      commonVehicles: s.array(s.string()).default([]),
      relatedCodes: s.array(obdCode).default([]),
      /** Dash light ids: check-engine, oil-pressure, … */
      relatedDashLights: s.array(s.string()).default([]),
      faq: s.array(faqItem).default([]),
      affiliateProducts: s.array(affiliateProduct).default([]),
      keywords: s.array(s.string()).default([]),
      robots: s.string().default('index, follow'),
      cover: s.image().optional(),
      coverAlt: s.string().max(125).optional(),
      lastReviewed: s.isodate().optional(),
    })
    .transform((data) => {
      const slug = data.code.toUpperCase()
      return {
        ...data,
        code: slug,
        slug,
        permalink: `/codes/${slug}`,
        canonical: `/codes/${slug}`,
        schemaType: 'TechArticle' as const,
        /** Ready for FAQPage when faq.length > 0 */
        hasFaq: data.faq.length > 0,
      }
    }),
})

// ─────────────────────────────────────────────
// 2–6. MDX articles
// ─────────────────────────────────────────────
const comparisons = defineCollection({
  name: 'ComparisonArticle',
  pattern: 'articles/comparisons/*.mdx',
  schema: s
    .object({
      ...seoFields,
      slug: articleSlug,
      ...eeatFields,
      draft: s.boolean().default(false),
      cover: s.image(),
      coverAlt: s.string().max(125),
      itemCount: s.number().min(2),
      winningPick: s.object({
        name: s.string(),
        rating: s.number().min(0).max(5),
        affiliateUrl: s.string().url(),
        summary: s.string().max(200),
      }),
      budgetPick: s
        .object({
          name: s.string(),
          rating: s.number().min(0).max(5),
          affiliateUrl: s.string().url(),
          summary: s.string().max(200),
        })
        .optional(),
      faq: s.array(faqItem).default([]),
      toc: s.toc(),
      excerpt: s.excerpt({ length: 160 }),
      body: s.mdx(),
      metadata: s.metadata(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/guides/${data.slug}`,
      canonical: `/guides/${data.slug}`,
      schemaType: 'Article' as const,
      hasFaq: data.faq.length > 0,
    })),
})

const deepCodes = defineCollection({
  name: 'DeepDiveArticle',
  pattern: 'articles/codes/*.mdx',
  schema: s
    .object({
      ...seoFields,
      slug: articleSlug,
      code: obdCode,
      ...eeatFields,
      draft: s.boolean().default(false),
      cover: s.image(),
      coverAlt: s.string().max(125),
      urgencyScore: s.number().min(1).max(10),
      affectedSystems: s.array(s.string()).min(1),
      diagnosticDifficulty: s.enum([
        'Beginner',
        'Intermediate',
        'Advanced',
        'Professional',
      ]),
      estimatedRepairTime: s.string(),
      relatedDashLights: s.array(s.string()).default([]),
      faq: s.array(faqItem).default([]),
      affiliateProducts: s.array(affiliateProduct).default([]),
      toc: s.toc(),
      excerpt: s.excerpt({ length: 160 }),
      body: s.mdx(),
      metadata: s.metadata(),
    })
    .transform((data) => {
      const code = data.code.toUpperCase()
      return {
        ...data,
        code,
        permalink: `/codes/${code}/guide`,
        canonical: `/codes/${code}/guide`,
        schemaType: 'TechArticle' as const,
        hasFaq: data.faq.length > 0,
      }
    }),
})

const deepProducts = defineCollection({
  name: 'DeepProductArticle',
  pattern: 'articles/products/*.mdx',
  schema: s
    .object({
      ...seoFields,
      slug: articleSlug,
      productName: s.string().min(3).max(80),
      brand: s.string(),
      model: s.string().optional(),
      ...eeatFields,
      draft: s.boolean().default(false),
      cover: s.image(),
      coverAlt: s.string().max(125),
      rating: s.number().min(0).max(5),
      priceTier: s.enum(['$', '$$', '$$$', '$$$$']),
      affiliateUrl: s.string().url(),
      pros: s.array(s.string()).min(2),
      cons: s.array(s.string()).min(1),
      verdict: s.string().max(300),
      faq: s.array(faqItem).default([]),
      toc: s.toc(),
      excerpt: s.excerpt({ length: 160 }),
      body: s.mdx(),
      metadata: s.metadata(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/reviews/${data.slug}`,
      canonical: `/reviews/${data.slug}`,
      schemaType: 'Product' as const,
      hasFaq: data.faq.length > 0,
    })),
})

const troubleshooting = defineCollection({
  name: 'TroubleshootingArticle',
  pattern: 'articles/troubleshooting/*.mdx',
  schema: s
    .object({
      ...seoFields,
      slug: articleSlug,
      symptom: s.string().min(5).max(100),
      ...eeatFields,
      draft: s.boolean().default(false),
      cover: s.image(),
      coverAlt: s.string().max(125),
      difficulty: s.enum(['Beginner', 'Intermediate', 'Advanced']),
      estimatedTime: s.string(),
      requiredTools: s.array(
        s.object({
          name: s.string(),
          affiliateUrl: s.string().url().optional(),
        })
      ),
      safetyWarnings: s.array(s.string()).default([]),
      relatedCodes: s.array(obdCode).default([]),
      relatedDashLights: s.array(s.string()).default([]),
      faq: s.array(faqItem).default([]),
      toc: s.toc(),
      excerpt: s.excerpt({ length: 160 }),
      body: s.mdx(),
      metadata: s.metadata(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/guides/${data.slug}`,
      canonical: `/guides/${data.slug}`,
      schemaType: 'HowTo' as const,
      hasFaq: data.faq.length > 0,
    })),
})

const decisions = defineCollection({
  name: 'DecisionArticle',
  pattern: 'articles/decisions/*.mdx',
  schema: s
    .object({
      ...seoFields,
      slug: articleSlug,
      ...eeatFields,
      draft: s.boolean().default(false),
      cover: s.image(),
      coverAlt: s.string().max(125),
      decisionTopic: s.string().min(5).max(80),
      quickVerdict: s.string().min(40).max(280),
      keyTakeaways: s.array(s.string()).min(3).max(7),
      estimatedSavings: s.string().optional(),
      faq: s.array(faqItem).default([]),
      toc: s.toc(),
      excerpt: s.excerpt({ length: 160 }),
      body: s.mdx(),
      metadata: s.metadata(),
    })
    .transform((data) => ({
      ...data,
      permalink: `/guides/${data.slug}`,
      canonical: `/guides/${data.slug}`,
      schemaType: 'Article' as const,
      hasFaq: data.faq.length > 0,
    })),
})

// ─────────────────────────────────────────────
// Dashboard icons (visual lookup)
// ─────────────────────────────────────────────
const dashboardIcons = defineCollection({
  name: 'DashboardIcon',
  pattern: 'dashboard-icons/*.json',
  schema: s
    .object({
      id: s
        .string()
        .min(1)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .pipe(s.unique('dashboard-icons')),
      name: s.string().min(1),
      aliases: s.array(s.string()).default([]),
      vehicleSpecific: s.boolean().default(false),
      color: s.enum(['red', 'amber', 'green', 'blue', 'white']),
      severity: s.enum(['critical', 'warning', 'info']),
      category: s.enum([
        'engine',
        'brakes',
        'safety',
        'drivetrain',
        'tires',
        'lighting',
        'transmission',
        'adas',
        'security',
        'body',
        'maintenance',
        'steering',
        'fuel',
        'emissions',
        'hybrid',
        'climate',
        'suspension',
        'system',
        'electrical',
      ]),
      definition: s.string().min(20).max(400),
      causes: s.array(s.string()).min(1),
      solutions: s.array(s.string()).min(1),
      stopDriving: s.boolean().default(false),
      urgencyNote: s.string().max(200).optional(),
      relatedProducts: s.array(s.string()).default([]),
      relatedObdCodes: s.array(obdCode).default([]),
      faq: s.array(faqItem).default([]),
      affiliateProducts: s.array(affiliateProduct).default([]),
      focusKeyword: s.string().max(80).optional(),
      keywords: s.array(s.string()).default([]),
      searchPriority: s.number().min(1).max(100).optional(),
      /** Relative to JSON → content/dashboard-icons/svg/{id}.svg */
      svg: s.file({ allowNonRelativePath: false }),
      /** Prefer currentColor SVGs for glow via CSS */
      glow: s.boolean().default(true),
    })
    .transform((data) => ({
      ...data,
      slug: data.id,
      permalink: `/dash-lights/${data.id}`,
      canonical: `/dash-lights/${data.id}`,
      schemaType: 'TechArticle' as const,
      hasFaq: data.faq.length > 0,
    })),
})

export default defineConfig({
  root: 'content',
  strict: process.env.NODE_ENV === 'production',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    clean: process.env.NODE_ENV === 'production',
  },
  collections: {
    codes,
    comparisons,
    deepCodes,
    deepProducts,
    troubleshooting,
    decisions,
    dashboardIcons,
  },
  prepare: (data) => {
    data.comparisons = data.comparisons.filter((a) => !a.draft)
    data.deepCodes = data.deepCodes.filter((a) => !a.draft)
    data.deepProducts = data.deepProducts.filter((a) => !a.draft)
    data.troubleshooting = data.troubleshooting.filter((a) => !a.draft)
    data.decisions = data.decisions.filter((a) => !a.draft)
    // Surface priority codes first for any consumer of the array
    data.codes = [...data.codes].sort((a, b) => {
      const pa = a.searchPriority ?? 999
      const pb = b.searchPriority ?? 999
      if (pa !== pb) return pa - pb
      return a.code.localeCompare(b.code)
    })
    data.dashboardIcons = [...data.dashboardIcons].sort((a, b) => {
      const pa = a.searchPriority ?? 999
      const pb = b.searchPriority ?? 999
      if (pa !== pb) return pa - pb
      return a.name.localeCompare(b.name)
    })
  },
})

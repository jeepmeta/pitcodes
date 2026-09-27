import { defineCollection, defineConfig, s } from 'velite'

// ─────────────────────────────────────────────
// Shared SEO + E-E-A-T helpers
// ─────────────────────────────────────────────

const seoFields = {
  title: s.string().min(10).max(70),
  description: s.string().min(50).max(160),
  keywords: s.array(s.string()).default([]),
  robots: s.string().default('index, follow'),
}

const eeatFields = {
  publishedAt: s.isodate(),
  updatedAt: s.isodate().optional(),
  author: s.string().default('PIT.CODES Automotive Team'),
  reviewer: s.string().default('ASE Certified Master Technician'),
}

/** Official OBD-II code shape: P|C|B|U + 4 digits */
const obdCode = s
  .string()
  .regex(/^[PCBU]\d{4}$/i, 'Invalid OBD-II code (expected P/C/B/U + 4 digits)')

const articleSlug = s.slug('articles', ['admin', 'login', 'api', 'codes', 'dash-lights'])

// ─────────────────────────────────────────────
// 1. Core OBD-II codes (money pages)
// ─────────────────────────────────────────────
const codes = defineCollection({
  name: 'DiagnosticCode',
  pattern: 'codes/**/*.json',
  schema: s
    .object({
      code: obdCode,
      title: s.string().min(10).max(70),
      description: s.string().min(50).max(160),
      category: s.enum(['Powertrain', 'Body', 'Chassis', 'Network']),
      severity: s.enum(['low', 'medium', 'high', 'critical']),
      symptoms: s.array(s.string()).min(1),
      causes: s.array(s.string()).min(1),
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
      keywords: s.array(s.string()).default([]),
      robots: s.string().default('index, follow'),
      cover: s.image().optional(),
      coverAlt: s.string().max(125).optional(),
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
      }
    }),
})

// ─────────────────────────────────────────────
// 2–6. MDX article collections
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
    })),
})

// ─────────────────────────────────────────────
// Dashboard icons
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
      definition: s.string().min(1),
      causes: s.array(s.string()).min(1),
      solutions: s.array(s.string()).min(1),
      relatedProducts: s.array(s.string()).default([]),
      relatedObdCodes: s.array(obdCode).default([]),
      // Relative to the JSON file → content/dashboard-icons/svg/…
      svg: s.file({ allowNonRelativePath: false }),
    })
    .transform((data) => ({
      ...data,
      slug: data.id,
      permalink: `/dash-lights/${data.id}`,
      canonical: `/dash-lights/${data.id}`,
      schemaType: 'TechArticle' as const,
    })),
})

export default defineConfig({
  root: 'content',
  // Fail CI on schema drift when generating for production
  strict: process.env.NODE_ENV === 'production',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    // Keep prior assets when watching; clean only on production builds
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
  },
})

import { defineCollection, defineConfig, s } from 'velite'

// ─────────────────────────────────────────────
// Shared SEO + E-E-A-T helpers (required on public content)
// ─────────────────────────────────────────────

const seoFields = {
  title: s.string().min(10).max(70),                    // aim 50-60 chars, front-load keyword
  description: s.string().min(50).max(160),             // aim 150-160 chars
  keywords: s.array(s.string()).default([]),
  robots: s.string().default('index, follow'),
  // cover is required on article collections for social previews
}

const eeatFields = {
  publishedAt: s.isodate(),
  updatedAt: s.isodate().optional(),
  author: s.string().default('PIT.CODES Automotive Team'),
  reviewer: s.string().default('ASE Certified Master Technician'),
}

// ─────────────────────────────────────────────
// 1. Core OBD-II Diagnostic Codes (high-value money pages)
// ─────────────────────────────────────────────
const codes = defineCollection({
  name: 'DiagnosticCode',
  pattern: 'codes/**/*.json',
  schema: s
    .object({
      code: s.string().regex(/^[BCCP]\d{4}$/i, 'Invalid OBD-II code format'),
      title: s.string().min(10).max(70),                 // e.g. "P0300 – Random/Multiple Cylinder Misfire"
      description: s.string().min(50).max(160),
      category: s.enum(['Powertrain', 'Body', 'Chassis', 'Network']),
      severity: s.enum(['low', 'medium', 'high', 'critical']),
      symptoms: s.array(s.string()).min(1),
      causes: s.array(s.string()).min(1),
      solutions: s.array(s.string()).min(1),
      estimatedCost: s.object({
        min: s.number().min(0),
        max: s.number().min(0),
        currency: s.string().default('USD'),
      }),
      commonVehicles: s.array(s.string()).default([]),
      keywords: s.array(s.string()).default([]),
      robots: s.string().default('index, follow'),
      // Optional cover for social sharing of popular codes
      cover: s.image().optional(),
      coverAlt: s.string().max(125).optional(),
    })
    .transform(data => {
      const slug = data.code.toUpperCase()
      return {
        ...data,
        slug,
        permalink: `/codes/${slug}`,
        canonical: `/codes/${slug}`,
        // Ready for structured data
        schemaType: 'TechArticle' as const,
      }
    }),
})

// ─────────────────────────────────────────────
// 2. Comparison Articles (tool / scanner round-ups)
// ─────────────────────────────────────────────
const comparisons = defineCollection({
  name: 'ComparisonArticle',
  pattern: 'articles/comparisons/*.mdx',
  schema: s
    .object({
      ...seoFields,
      slug: s.slug('articles', ['admin', 'login', 'api', 'codes']),
      ...eeatFields,
      draft: s.boolean().default(false),
      cover: s.image(),                                  // required for social
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
      metadata: s.metadata(),                            // readingTime + wordCount
    })
    .transform(data => ({
      ...data,
      permalink: `/guides/${data.slug}`,
      canonical: `/guides/${data.slug}`,
      schemaType: 'Article' as const,
    })),
})

// ─────────────────────────────────────────────
// 3. Deep-Dive Code Articles (long-form P0xxx pages)
// ─────────────────────────────────────────────
const deepCodes = defineCollection({
  name: 'DeepDiveArticle',
  pattern: 'articles/codes/*.mdx',
  schema: s
    .object({
      ...seoFields,
      slug: s.slug('articles', ['admin', 'login', 'api', 'codes']),
      code: s.string().regex(/^[BCCP]\d{4}$/i),
      ...eeatFields,
      draft: s.boolean().default(false),
      cover: s.image(),
      coverAlt: s.string().max(125),
      urgencyScore: s.number().min(1).max(10),
      affectedSystems: s.array(s.string()).min(1),
      diagnosticDifficulty: s.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional']),
      estimatedRepairTime: s.string(),
      toc: s.toc(),
      excerpt: s.excerpt({ length: 160 }),
      body: s.mdx(),
      metadata: s.metadata(),
    })
    .transform(data => ({
      ...data,
      permalink: `/codes/${data.code.toUpperCase()}/guide`,
      canonical: `/codes/${data.code.toUpperCase()}/guide`,
      schemaType: 'TechArticle' as const,
    })),
})

// ─────────────────────────────────────────────
// 4. Deep Product Reviews (scanners, tools, parts)
// ─────────────────────────────────────────────
const deepProducts = defineCollection({
  name: 'DeepProductArticle',
  pattern: 'articles/products/*.mdx',
  schema: s
    .object({
      ...seoFields,
      slug: s.slug('articles', ['admin', 'login', 'api', 'codes']),
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
    .transform(data => ({
      ...data,
      permalink: `/reviews/${data.slug}`,
      canonical: `/reviews/${data.slug}`,
      schemaType: 'Product' as const,                   // or Review
    })),
})

// ─────────────────────────────────────────────
// 5. Troubleshooting Guides (symptom → fix workflows)
// ─────────────────────────────────────────────
const troubleshooting = defineCollection({
  name: 'TroubleshootingArticle',
  pattern: 'articles/troubleshooting/*.mdx',
  schema: s
    .object({
      ...seoFields,
      slug: s.slug('articles', ['admin', 'login', 'api', 'codes']),
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
    .transform(data => ({
      ...data,
      permalink: `/guides/${data.slug}`,
      canonical: `/guides/${data.slug}`,
      schemaType: 'HowTo' as const,
    })),
})

// ─────────────────────────────────────────────
// 6. Decision Guides (high-intent “should I …?” pages)
// ─────────────────────────────────────────────
const decisions = defineCollection({
  name: 'DecisionArticle',
  pattern: 'articles/decisions/*.mdx',
  schema: s
    .object({
      ...seoFields,
      slug: s.slug('articles', ['admin', 'login', 'api', 'codes']),
      ...eeatFields,
      draft: s.boolean().default(false),
      cover: s.image(),
      coverAlt: s.string().max(125),
      decisionTopic: s.string().min(5).max(80),
      // Optimized for Featured Snippets / AI Overviews
      quickVerdict: s.string().min(40).max(280),
      keyTakeaways: s.array(s.string()).min(3).max(7),
      estimatedSavings: s.string().optional(),
      toc: s.toc(),
      excerpt: s.excerpt({ length: 160 }),
      body: s.mdx(),
      metadata: s.metadata(),
    })
    .transform(data => ({
      ...data,
      permalink: `/guides/${data.slug}`,
      canonical: `/guides/${data.slug}`,
      schemaType: 'Article' as const,
    })),
})

// ─────────────────────────────────────────────
// 6. Dashboard symbol icons and diagnostic metadata
// ─────────────────────────────────────────────
const dashboardIcons = defineCollection({
    name: 'DashboardIcon',
    pattern: 'dashboard-icons/*.json',
    schema: s.object({
      id: s
        .string()
        .min(1)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .pipe(s.unique('dashboard-icons')),
      name: s.string().min(1),
      aliases: s.array(s.string()),
      vehicleSpecific: s.boolean(),
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
      causes: s.array(s.string()),
      solutions: s.array(s.string()),
      relatedProducts: s.array(s.string()),
      relatedObdCodes: s.array(s.string()),
      svg: s.file({ allowNonRelativePath: false }),
    }),
})

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────
export default defineConfig({
  root: 'content',
  collections: {
    codes,
    comparisons,
    deepCodes,
    deepProducts,
    troubleshooting,
    decisions,
    dashboardIcons,
  },
  // Optional but recommended: strip drafts before writing output
  prepare: (data) => {
    data.comparisons = data.comparisons.filter(a => !a.draft)
    data.deepCodes = data.deepCodes.filter(a => !a.draft)
    data.deepProducts = data.deepProducts.filter(a => !a.draft)
    data.troubleshooting = data.troubleshooting.filter(a => !a.draft)
    data.decisions = data.decisions.filter(a => !a.draft)
  },
})
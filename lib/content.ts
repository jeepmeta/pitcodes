/**
 * Safe accessors for Velite output (`.velite`).
 */

export type FaqItem = { question: string; answer: string }

export type AffiliateProduct = {
  name: string
  url: string
  blurb?: string
  asin?: string
}

export type DashboardIcon = {
  id: string
  slug?: string
  name: string
  aliases: string[]
  vehicleSpecific: boolean
  color: 'red' | 'amber' | 'green' | 'blue' | 'white'
  severity: 'critical' | 'warning' | 'info'
  category: string
  definition: string
  causes: string[]
  solutions: string[]
  relatedProducts: string[]
  relatedObdCodes: string[]
  faq?: FaqItem[]
  affiliateProducts?: AffiliateProduct[]
  stopDriving?: boolean
  urgencyNote?: string
  searchPriority?: number
  glow?: boolean
  svg?: string
  permalink?: string
  canonical?: string
  hasFaq?: boolean
}

export type DiagnosticCode = {
  code: string
  slug: string
  title: string
  description: string
  focusKeyword?: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  searchPriority?: number
  enriched?: boolean
  stopDriving?: boolean
  urgencyNote?: string
  symptoms: string[]
  causes: string[]
  solutions: string[]
  estimatedCost?: { min: number; max: number; currency: string }
  commonVehicles?: string[]
  relatedCodes?: string[]
  relatedDashLights?: string[]
  faq?: FaqItem[]
  affiliateProducts?: AffiliateProduct[]
  keywords?: string[]
  permalink?: string
  canonical?: string
  hasFaq?: boolean
  lastReviewed?: string
}

type SiteModule = {
  dashboardIcons?: DashboardIcon[]
  codes?: DiagnosticCode[]
}

async function loadSite(): Promise<SiteModule> {
  try {
    return (await import('#site/content')) as SiteModule
  } catch {
    return {}
  }
}

export async function getDashboardIcons(): Promise<DashboardIcon[]> {
  const mod = await loadSite()
  return mod.dashboardIcons ?? []
}

export async function getDashboardIcon(
  slug: string
): Promise<DashboardIcon | undefined> {
  const icons = await getDashboardIcons()
  return icons.find((i) => i.id === slug || i.slug === slug)
}

export async function getCodes(): Promise<DiagnosticCode[]> {
  const mod = await loadSite()
  return mod.codes ?? []
}

export async function getCode(
  code: string
): Promise<DiagnosticCode | undefined> {
  const list = await getCodes()
  const key = code.toUpperCase()
  return list.find((c) => c.code.toUpperCase() === key || c.slug === key)
}

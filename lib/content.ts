/**
 * Safe accessors for Velite output.
 * Returns empty arrays when `.velite` is not built yet so the app still boots.
 */

export type DashboardIcon = {
  id: string
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
  svg?: string
}

export type DiagnosticCode = {
  code: string
  slug: string
  title: string
  description: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  symptoms: string[]
  causes: string[]
  solutions: string[]
  estimatedCost?: { min: number; max: number; currency: string }
  commonVehicles?: string[]
  permalink?: string
  canonical?: string
}

export async function getDashboardIcons(): Promise<DashboardIcon[]> {
  try {
    const mod = await import('#site/content')
    return (mod as { dashboardIcons?: DashboardIcon[] }).dashboardIcons ?? []
  } catch {
    return []
  }
}

export async function getDashboardIcon(
  slug: string
): Promise<DashboardIcon | undefined> {
  const icons = await getDashboardIcons()
  return icons.find((i) => i.id === slug)
}

export async function getCodes(): Promise<DiagnosticCode[]> {
  try {
    const mod = await import('#site/content')
    return (mod as { codes?: DiagnosticCode[] }).codes ?? []
  } catch {
    return []
  }
}

export async function getCode(
  code: string
): Promise<DiagnosticCode | undefined> {
  const list = await getCodes()
  const key = code.toUpperCase()
  return list.find((c) => c.code.toUpperCase() === key || c.slug === key)
}

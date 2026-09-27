import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider border',
  {
    variants: {
      severity: {
        low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        critical: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse',
      },
    },
    defaultVariants: {
      severity: 'low',
    },
  }
)

export interface SeverityBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function SeverityBadge({ className, severity, ...props }: SeverityBadgeProps) {
  return (
    <div className={cn(badgeVariants({ severity }), className)} {...props} />
  )
}
import { cn } from '@/lib/utils/utils'

type Placement = 'inline' | 'sidebar' | 'after-content'

export function AdSlot({
  slotId,
  placement = 'inline',
  className,
}: {
  slotId: string
  placement?: Placement
  className?: string
}) {
  // Wire real ad network script later; reserve space so layout does not jump.
  return (
    <aside
      data-ad-slot={slotId}
      data-placement={placement}
      aria-label="Advertisement"
      className={cn(
        'flex min-h-[90px] items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/50 text-xs text-zinc-600',
        placement === 'after-content' && 'my-8',
        placement === 'sidebar' && 'sticky top-20',
        className
      )}
    >
      <span className="sr-only">Advertisement slot {slotId}</span>
      <span aria-hidden="true">Ad</span>
    </aside>
  )
}

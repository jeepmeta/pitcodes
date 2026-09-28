import { cn } from '@/lib/utils/utils'

const colorGlow: Record<string, string> = {
  red: 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.85)]',
  amber: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.85)]',
  green: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.75)]',
  blue: 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]',
  white: 'text-zinc-100 drop-shadow-[0_0_6px_rgba(244,244,245,0.7)]',
}

/**
 * Renders a dash SVG with lit-glow styling.
 * SVGs must use fill/stroke="currentColor" (not hardcoded hex).
 */
export function GlowIcon({
  src,
  color,
  name,
  size = 56,
  className,
  glow = true,
}: {
  src?: string
  color: string
  name: string
  size?: number
  className?: string
  glow?: boolean
}) {
  if (!src) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-lg bg-zinc-900 text-xs text-zinc-500',
          className
        )}
        style={{ width: size, height: size }}
      >
        {name.slice(0, 3)}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn(
        'object-contain',
        glow !== false && (colorGlow[color] ?? colorGlow.amber),
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    />
  )
}

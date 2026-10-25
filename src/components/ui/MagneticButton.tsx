import type { MouseEvent, ReactNode } from 'react'
import { useMagnetic } from '../../lib/hooks'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: (e: MouseEvent) => void
  variant?: 'solid' | 'ghost'
  className?: string
  cursor?: string
  type?: 'button' | 'submit'
}

const base =
  'group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-medium tracking-tight transition-[transform,color,border-color] duration-500 ease-(--ease-expo) will-change-transform'

const variants = {
  solid: 'bg-paper text-ink',
  ghost: 'border border-line text-paper hover:border-paper/40',
}

/** Pill button that leans toward the cursor and floods with accent color on hover. */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
  cursor,
  type = 'button',
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>(0.3)

  const content = (
    <>
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full rounded-[inherit] bg-accent transition-transform duration-500 ease-(--ease-expo) group-hover:translate-y-0"
      />
      <span className="relative z-10 flex items-center gap-3 transition-colors duration-300 group-hover:text-ink">
        {children}
      </span>
    </>
  )

  const props = {
    ref,
    className: `${base} ${variants[variant]} ${className}`,
    'data-cursor': cursor,
  }

  if (href) {
    return (
      <a {...props} href={href} onClick={onClick}>
        {content}
      </a>
    )
  }
  return (
    <button {...props} type={type} onClick={onClick}>
      {content}
    </button>
  )
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={`h-3.5 w-3.5 ${className}`} aria-hidden>
      <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PlayIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-3 w-3 ${className}`} aria-hidden>
      <path d="M4 2.5v11a.5.5 0 0 0 .77.42l8.5-5.5a.5.5 0 0 0 0-.84l-8.5-5.5A.5.5 0 0 0 4 2.5z" fill="currentColor" />
    </svg>
  )
}

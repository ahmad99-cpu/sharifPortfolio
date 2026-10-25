import { useRef, type CSSProperties, type ReactNode } from 'react'
import { useInView } from '../../lib/hooks'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

/** Fades and lifts its children in when scrolled into view. */
export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  return (
    <div
      ref={ref}
      data-in={inView}
      className={`reveal ${className}`}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

interface RevealLinesProps {
  lines: ReactNode[]
  className?: string
  delay?: number
  stagger?: number
  /** Force the animation state instead of waiting for the viewport (used by the hero). */
  show?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'p'
}

/** Headline whose lines slide up from behind a mask, one after another. */
export function RevealLines({ lines, className = '', delay = 0, stagger = 90, show, as: Tag = 'h2' }: RevealLinesProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref)
  return (
    <Tag ref={ref} data-in={show ?? inView} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span style={{ '--d': `${delay + i * stagger}ms` } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

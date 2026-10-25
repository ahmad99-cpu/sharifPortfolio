import type { ReactNode } from 'react'
import { Reveal, RevealLines } from './Reveal'

interface SectionHeaderProps {
  index: string
  label: string
  title: ReactNode[]
  aside?: ReactNode
}

/** Numbered section label ("02 — Before / After") with a masked headline. */
export default function SectionHeader({ index, label, title, aside }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-6">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-mute uppercase">
            <span className="text-accent">{index}</span>
            <span className="h-px w-8 bg-line" />
            {label}
          </p>
        </Reveal>
        <RevealLines
          lines={title}
          className="text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.92] font-medium tracking-[-0.045em]"
        />
      </div>
      {aside && (
        <Reveal delay={200} className="md:max-w-sm md:pb-3">
          {aside}
        </Reveal>
      )}
    </div>
  )
}

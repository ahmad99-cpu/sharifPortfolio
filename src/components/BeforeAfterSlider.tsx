import { useRef, useState } from 'react'
import type { Comparison } from '../data/content'
import { useCompareSlider, useSyncedClips, videoClip, type Clip } from '../lib/compare'
import { useInView } from '../lib/hooks'
import { toTimecode } from '../lib/timecode'

const RAW_LOOK = 'saturate(0.22) contrast(0.78) brightness(1.12) sepia(0.08)'

export default function BeforeAfterSlider({ comparison }: { comparison: Comparison }) {
  const { kind, before, after, beforeLabel = 'Before', afterLabel = 'After', simulateRaw, title } = comparison
  const containerRef = useRef<HTMLDivElement>(null)
  const beforeClip = useRef<Clip | null>(null)
  const afterClip = useRef<Clip | null>(null)
  const timecodeRef = useRef<HTMLSpanElement>(null)
  const [playing, setPlaying] = useState(true)
  const inView = useInView(containerRef, { once: false, rootMargin: '0px' })
  const { position, dragging, auto, handlers, onKeyDown } = useCompareSlider(containerRef, { inView })

  useSyncedClips(afterClip, beforeClip, {
    active: kind === 'video' && inView,
    playing,
    onTick: (time) => {
      if (timecodeRef.current) timecodeRef.current.textContent = toTimecode(time)
    },
  })

  const rawStyle = simulateRaw ? { filter: RAW_LOOK } : undefined
  const mediaClass = 'absolute inset-0 h-full w-full object-cover'

  return (
    <div
      ref={containerRef}
      className="group/slider relative aspect-video w-full touch-pan-y overflow-hidden rounded-xl bg-ink-3 select-none"
      {...handlers}
    >
      {/* After: full frame underneath */}
      {kind === 'video' ? (
        <video ref={(el) => void (afterClip.current = el && videoClip(el))} src={after} className={mediaClass} muted loop playsInline preload="metadata" aria-hidden />
      ) : (
        <img src={after} alt="" className={mediaClass} draggable={false} />
      )}

      {/* Before: clipped to the left of the handle */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {kind === 'video' ? (
          <video ref={(el) => void (beforeClip.current = el && videoClip(el))} src={before} className={mediaClass} style={rawStyle} muted loop playsInline preload="metadata" aria-hidden />
        ) : (
          <img src={before} alt="" className={mediaClass} style={rawStyle} draggable={false} />
        )}
      </div>

      {/* Labels fade as the handle covers them */}
      <span
        className="absolute top-4 left-4 rounded-full bg-ink/60 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase backdrop-blur-md transition-opacity duration-300 md:top-5 md:left-5"
        style={{ opacity: position < 18 ? 0 : 1 }}
      >
        {beforeLabel}
      </span>
      <span
        className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-paper uppercase transition-opacity duration-300 md:top-5 md:right-5"
        style={{ opacity: position > 82 ? 0 : 1 }}
      >
        {afterLabel}
      </span>

      {/* Handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${title}: drag to compare ${beforeLabel} and ${afterLabel}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% ${beforeLabel}`}
        onKeyDown={onKeyDown}
        className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-paper outline-none"
        style={{ left: `${position}%` }}
      >
        <div
          className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-full bg-paper text-ink shadow-[0_8px_30px_rgb(0_0_0/0.4)] transition-[width,height] duration-500 ease-expo group-focus-within/slider:ring-2 group-focus-within/slider:ring-accent ${
            dragging ? 'h-16 w-16' : 'h-12 w-12'
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span
          aria-hidden
          className={`absolute top-[calc(50%+2.25rem)] left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] whitespace-nowrap uppercase backdrop-blur-md transition-opacity duration-500 ${
            auto ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Drag to compare
        </span>
      </div>

      {kind === 'video' && (
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between md:inset-x-5 md:bottom-5">
          <button
            type="button"
            data-control
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause comparison' : 'Play comparison'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 backdrop-blur-md transition-colors hover:bg-ink/80"
          >
            {playing ? (
              <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
                <path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="ml-0.5 h-3 w-3" aria-hidden>
                <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
              </svg>
            )}
          </button>
          <span ref={timecodeRef} className="rounded-full bg-ink/60 px-3 py-1.5 font-mono text-[10px] tabular-nums backdrop-blur-md">
            {toTimecode(0)}
          </span>
        </div>
      )}
    </div>
  )
}

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Comparison } from '../data/content'
import { useInView } from '../lib/hooks'
import { toTimecode } from '../lib/timecode'

const RAW_LOOK = 'saturate(0.22) contrast(0.78) brightness(1.12) sepia(0.08)'

// Auto-play: the handle glides back and forth until the visitor takes over.
const AUTO_PERIOD_MS = 7000
const AUTO_SWING = 34 // percent either side of center

export default function BeforeAfterSlider({ comparison }: { comparison: Comparison }) {
  const { kind, before, after, beforeLabel = 'Before', afterLabel = 'After', simulateRaw, title } = comparison
  const containerRef = useRef<HTMLDivElement>(null)
  const beforeVideo = useRef<HTMLVideoElement>(null)
  const afterVideo = useRef<HTMLVideoElement>(null)
  const timecodeRef = useRef<HTMLSpanElement>(null)
  // Time spent auto-moving, kept across pauses so the motion resumes where it left off.
  const autoElapsed = useRef(0)
  const dragging = useRef(false)

  const [position, setPosition] = useState(50)
  const [active, setActive] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [auto, setAuto] = useState(true)
  const inView = useInView(containerRef, { once: false, rootMargin: '0px' })

  // Glide while on screen; stops for good once the visitor drags, taps or uses the keyboard.
  useEffect(() => {
    if (!auto || !inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let last = performance.now()
    let raf = 0
    const tick = (now: number) => {
      autoElapsed.current += now - last
      last = now
      setPosition(50 + AUTO_SWING * Math.sin((autoElapsed.current / AUTO_PERIOD_MS) * Math.PI * 2))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [auto, inView])

  // Play only while visible, and keep the "before" layer locked to the "after" layer's clock.
  useEffect(() => {
    if (kind !== 'video') return
    const a = afterVideo.current
    const b = beforeVideo.current
    if (!a || !b) return

    if (inView && playing) {
      a.play().catch(() => {})
      b.play().catch(() => {})
    } else {
      a.pause()
      b.pause()
    }

    let raf = 0
    const sync = () => {
      if (Math.abs(b.currentTime - a.currentTime) > 0.08) b.currentTime = a.currentTime
      if (timecodeRef.current) timecodeRef.current.textContent = toTimecode(a.currentTime)
      raf = requestAnimationFrame(sync)
    }
    if (inView) raf = requestAnimationFrame(sync)
    return () => cancelAnimationFrame(raf)
  }, [kind, inView, playing, before, after])

  const updateFromPointer = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }, [])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('[data-control]')) return
    setAuto(false)
    dragging.current = true
    setActive(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    updateFromPointer(e.clientX)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) updateFromPointer(e.clientX)
  }
  const endDrag = () => {
    dragging.current = false
    setActive(false)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2
    const next = { ArrowLeft: position - step, ArrowRight: position + step, Home: 0, End: 100 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    setAuto(false)
    setPosition(Math.min(100, Math.max(0, next)))
  }

  const rawStyle = simulateRaw ? { filter: RAW_LOOK } : undefined
  const mediaClass = 'absolute inset-0 h-full w-full object-cover'

  return (
    <div
      ref={containerRef}
      className="group/slider relative aspect-video w-full touch-pan-y overflow-hidden rounded-xl bg-ink-3 select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      data-cursor="Drag"
    >
      {/* After: full frame underneath */}
      {kind === 'video' ? (
        <video ref={afterVideo} src={after} className={mediaClass} muted loop playsInline preload="metadata" aria-hidden />
      ) : (
        <img src={after} alt="" className={mediaClass} draggable={false} />
      )}

      {/* Before: clipped to the left of the handle */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {kind === 'video' ? (
          <video ref={beforeVideo} src={before} className={mediaClass} style={rawStyle} muted loop playsInline preload="metadata" aria-hidden />
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
        className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-ink uppercase transition-opacity duration-300 md:top-5 md:right-5"
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
            active ? 'h-16 w-16' : 'h-12 w-12'
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
            data-cursor={playing ? 'Pause' : 'Play'}
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

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import type { Comparison } from '../data/content'
import { useCompareSlider, useSyncedClips, type Clip } from '../lib/compare'
import { useInView } from '../lib/hooks'
import ClipSource from './ClipSource'

type Mode = 'side' | 'slide'

const MODES: { id: Mode; label: string }[] = [
  { id: 'side', label: 'Side by side' },
  { id: 'slide', label: 'Slider' },
]
const LABEL_SPACE = 64 // room above the frames for the big Before / After labels
const MORPH_MS = 900

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

/**
 * Vertical before/after showcase (self-hosted files or YouTube). The same two synced clips are laid out side by side
 * or stacked into a drag wipe; switching modes morphs the frames without restarting playback.
 */
export default function PortraitComparison({ comparison }: { comparison: Comparison }) {
  const { kind, before, after, beforePoster, afterPoster, beforeLabel = 'Before', afterLabel = 'After', hasAudio, title } =
    comparison

  const stageRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const beforeClip = useRef<Clip | null>(null)
  const afterClip = useRef<Clip | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const seeking = useRef(false)

  const [mode, setMode] = useState<Mode>('side')
  const [focus, setFocus] = useState<'before' | 'after'>('after')
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [morphing, setMorphing] = useState(false)
  const [box, setBox] = useState({ width: 0, viewport: 0 })

  const inView = useInView(stageRef, { once: false, rootMargin: '0px' })
  const slider = useCompareSlider(overlayRef, { enabled: mode === 'slide', inView })

  useSyncedClips(afterClip, beforeClip, {
    active: inView,
    playing,
    onTick: (time, duration) => {
      if (fillRef.current && duration) fillRef.current.style.width = `${(time / duration) * 100}%`
      if (timeRef.current) timeRef.current.textContent = `${clock(time)} / ${clock(duration)}`
    },
  })

  // The "after" clip carries the soundtrack.
  useEffect(() => {
    afterClip.current?.setMuted(muted)
  }, [muted])

  // Size the frames from the available width and the viewport height.
  useEffect(() => {
    const el = measureRef.current
    if (!el) return
    const update = () => setBox({ width: el.clientWidth, viewport: window.innerHeight })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const switchMode = (next: Mode) => {
    if (next === mode) return
    setMode(next)
    setMorphing(true)
    window.setTimeout(() => setMorphing(false), MORPH_MS)
  }

  // Timeline scrubbing: click or drag to move both videos together.
  const seekTo = (clientX: number) => {
    const track = trackRef.current
    const a = afterClip.current
    const b = beforeClip.current
    if (!track || !a?.ready() || !b?.ready() || !a.duration()) return
    const rect = track.getBoundingClientRect()
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * a.duration()
    a.seek(t)
    b.seek(t)
  }
  const scrub = {
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => {
      seeking.current = true
      e.currentTarget.setPointerCapture(e.pointerId)
      seekTo(e.clientX)
    },
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
      if (seeking.current) seekTo(e.clientX)
    },
    onPointerUp: () => {
      seeking.current = false
    },
  }

  // Geometry: frame width is capped by viewport height so the whole showcase fits on screen.
  const gap = box.width < 640 ? 14 : 36
  const maxW = Math.min((box.viewport * 0.62 * 9) / 16, 380)
  const side = mode === 'side'
  const w = side ? Math.min((box.width - gap) / 2, maxW) : Math.min(box.width, maxW * 1.1)
  const h = (w * 16) / 9
  const offset = side ? (w + gap) / 2 : 0
  const ready = box.width > 0

  const frameStyle = (x: number, scale: number): CSSProperties => ({
    width: w,
    height: h,
    top: LABEL_SPACE,
    transform: `translateX(calc(-50% + ${x}px)) scale(${scale})`,
    transformOrigin: '50% 100%',
    transition: `transform ${MORPH_MS}ms var(--ease-expo), width ${MORPH_MS}ms var(--ease-expo), height ${MORPH_MS}ms var(--ease-expo), opacity 600ms ease${
      morphing ? `, clip-path ${MORPH_MS}ms var(--ease-expo)` : ''
    }`,
  })

  const beforeScale = side && focus === 'after' ? 0.9 : 1
  const afterScale = side && focus === 'before' ? 0.9 : 1
  const sourceKind = kind === 'youtube' ? 'youtube' : 'video'

  return (
    <div ref={stageRef} className="overflow-hidden rounded-2xl border border-line bg-black">
      {/* Mode switch */}
      <div className="flex justify-center px-4 pt-6 md:pt-8">
        <div role="group" aria-label="Comparison view" className="relative inline-flex rounded-full border border-paper/15 p-1">
          <span
            aria-hidden
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-paper transition-transform duration-500 ease-expo"
            style={{ transform: side ? 'translateX(0)' : 'translateX(100%)' }}
          />
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => switchMode(m.id)}
              className={`relative z-10 min-w-28 rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                mode === m.id ? 'text-ink' : 'text-paper/60 hover:text-paper'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stage */}
      <div className="px-4 md:px-10">
        <div
          ref={measureRef}
          className="relative w-full"
          style={{ height: ready ? h + LABEL_SPACE + 8 : 520, transition: `height ${MORPH_MS}ms var(--ease-expo)` }}
        >
          {ready && (
            <>
              {/* Big labels above each frame (side-by-side only) */}
              {[
                { text: beforeLabel, x: -offset, scale: beforeScale, accent: false },
                { text: afterLabel, x: offset, scale: afterScale, accent: true },
              ].map((l) => (
                <span
                  key={l.text}
                  aria-hidden
                  className={`absolute left-1/2 leading-none transition-[opacity,transform] duration-700 ease-expo ${
                    l.accent
                      ? 'text-[clamp(1.9rem,4.2vw,3rem)] text-accent [text-shadow:0_0_22px_rgb(211_0_0/0.65),0_0_2px_rgb(211_0_0/0.8)]'
                      : 'text-[clamp(1.4rem,3vw,2.15rem)] text-white [text-shadow:0_0_18px_rgb(255_255_255/0.45),0_0_2px_rgb(255_255_255/0.6)]'
                  } font-label font-black tracking-[-0.01em] uppercase italic ${
                    side ? 'opacity-100' : 'opacity-0'
                  }`}
                  // Bottom-anchored just above the frame, following its top edge as the frame scales from its base.
                  style={{
                    top: LABEL_SPACE - 10,
                    transform: `translate(calc(-50% + ${l.x}px), calc(-100% + ${side ? h * (1 - l.scale) : 12}px))`,
                  }}
                >
                  {l.text}
                </span>
              ))}

              {/* Glow behind the finished cut */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 rounded-[2rem] bg-accent/40 blur-3xl transition-opacity duration-700"
                style={{ ...frameStyle(offset, afterScale * 0.92), opacity: side ? (focus === 'after' ? 0.9 : 0.35) : 0.45 }}
              />

              {/* After */}
              <div
                className="absolute left-1/2"
                style={{ ...frameStyle(offset, afterScale), opacity: side && focus === 'before' ? 0.7 : 1, zIndex: 1 }}
                onPointerEnter={() => side && setFocus('after')}
              >
                <ClipSource kind={sourceKind} src={after} poster={afterPoster} clipRef={afterClip} />
              </div>

              {/* Before: beside the after, or clipped over it as a wipe */}
              <div
                className="absolute left-1/2"
                style={{
                  ...frameStyle(-offset, beforeScale),
                  opacity: side && focus === 'after' ? 0.7 : 1,
                  clipPath: side ? 'inset(0 0 0 0)' : `inset(0 ${100 - slider.position}% 0 0)`,
                  zIndex: 2,
                }}
                onPointerEnter={() => side && setFocus('before')}
              >
                <ClipSource kind={sourceKind} src={before} poster={beforePoster} clipRef={beforeClip} />
              </div>

              {/* Slider overlay: handle, corner labels and drag surface */}
              <div
                ref={overlayRef}
                {...slider.handlers}
                className={`absolute left-1/2 touch-pan-y select-none ${side ? 'pointer-events-none' : ''}`}
                style={{ ...frameStyle(0, 1), zIndex: 3 }}
              >
                <div className={`transition-opacity duration-500 ${side ? 'opacity-0' : 'opacity-100 delay-300'}`}>
                  <span
                    className="absolute top-[7%] left-[8%] rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] uppercase backdrop-blur-md transition-opacity"
                    style={{ opacity: slider.position < 22 ? 0 : 1 }}
                  >
                    {beforeLabel}
                  </span>
                  <span
                    className="absolute top-[7%] right-[8%] rounded-full bg-accent px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] text-paper uppercase transition-opacity"
                    style={{ opacity: slider.position > 78 ? 0 : 1 }}
                  >
                    {afterLabel}
                  </span>

                  <div
                    role="slider"
                    tabIndex={side ? -1 : 0}
                    aria-hidden={side}
                    aria-label={`${title}: drag to compare ${beforeLabel} and ${afterLabel}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(slider.position)}
                    onKeyDown={slider.onKeyDown}
                    className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-paper outline-none"
                    style={{ left: `${slider.position}%` }}
                  >
                    <div
                      className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-[0_8px_30px_rgb(0_0_0/0.5)] transition-[width,height] duration-500 ease-expo ${
                        slider.dragging ? 'h-14 w-14' : 'h-11 w-11'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                        <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span
                      aria-hidden
                      className={`absolute top-[calc(50%+2rem)] left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] whitespace-nowrap uppercase backdrop-blur-md transition-opacity duration-500 ${
                        slider.auto ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      Drag to compare
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transport: play, timeline scrubber, time, sound */}
      <div className="mt-4 flex items-center gap-4 border-t border-paper/10 px-4 py-4 md:px-8">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause comparison' : 'Play comparison'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper/15 transition-colors hover:border-paper/40 hover:bg-paper/5"
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

        <div
          ref={trackRef}
          {...scrub}
          role="presentation"
          className="group/track relative h-8 flex-1 touch-none"
        >
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-paper/15" />
          <div ref={fillRef} className="absolute top-1/2 left-0 h-[2px] w-0 -translate-y-1/2 bg-accent">
            <span className="absolute top-1/2 right-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 scale-75 rounded-full bg-paper transition-transform duration-300 group-hover/track:scale-100" />
          </div>
        </div>

        <span ref={timeRef} className="shrink-0 font-mono text-[11px] text-paper/70 tabular-nums">
          0:00 / 0:00
        </span>

        {hasAudio && (
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
            aria-pressed={!muted}
            className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-3 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors ${
              muted ? 'border-paper/15 text-paper/70 hover:border-paper/40 hover:text-paper' : 'border-accent bg-accent text-paper'
            }`}
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path d="M2.5 6h2.2L8 3.2v9.6L4.7 10H2.5z" fill="currentColor" />
              {muted ? (
                <path d="M11 6l3.5 4M14.5 6L11 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              ) : (
                <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.3 3.8a6 6 0 0 1 0 8.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              )}
            </svg>
            <span className="hidden sm:inline">{muted ? 'Sound off' : 'Sound on'}</span>
          </button>
        )}
      </div>
    </div>
  )
}

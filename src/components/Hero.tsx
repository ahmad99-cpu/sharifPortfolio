import { useEffect, useRef, type CSSProperties } from 'react'
import { showreel, site } from '../data/content'
import { scrollToTarget } from '../lib/scroll'
import { toTimecode } from '../lib/timecode'
import { RevealLines } from './ui/Reveal'
import MagneticButton, { Arrow, PlayIcon } from './ui/MagneticButton'

interface HeroProps {
  ready: boolean
  onPlayReel: () => void
}

export default function Hero({ ready, onPlayReel }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timecodeRef = useRef<HTMLSpanElement>(null)

  // Live timecode read straight off the background video.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const v = videoRef.current
      if (v && timecodeRef.current) timecodeRef.current.textContent = `TC ${toTimecode(v.currentTime)}`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Footage drifts and dims as the hero scrolls away.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current
        const media = mediaRef.current
        if (!el || !media) return
        const p = Math.min(1, Math.max(0, window.scrollY / el.offsetHeight))
        media.style.transform = `translate3d(0, ${p * 18}%, 0) scale(${1.08 - p * 0.04})`
        media.style.opacity = String(1 - p * 0.7)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const fade = (delay: number) =>
    ({
      transition: 'opacity 1.2s var(--ease-expo), transform 1.4s var(--ease-expo)',
      transitionDelay: `${delay}ms`,
      opacity: ready ? 1 : 0,
      transform: ready ? 'none' : 'translate3d(0, 24px, 0)',
    }) as CSSProperties

  return (
    <section ref={sectionRef} id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div ref={mediaRef} className="absolute inset-0 scale-[1.08] will-change-transform">
          <video
            ref={videoRef}
            className={`h-full w-full object-cover transition-[filter,transform] duration-[2400ms] ease-expo ${
              ready ? 'blur-0' : 'scale-110 blur-md'
            }`}
            src={showreel.background.src}
            poster={showreel.background.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
        </div>
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent_0%,rgb(9_9_10/0.75)_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
      </div>

      {/* Viewfinder corners */}
      <div aria-hidden className="pointer-events-none absolute inset-x-8 top-28 bottom-8 hidden md:block" style={fade(500)}>
        {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'right-0 bottom-0 border-r border-b'].map(
          (pos) => (
            <span key={pos} className={`absolute h-5 w-5 border-paper/40 ${pos}`} />
          ),
        )}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pt-32 pb-10 md:px-10 md:pb-14">
        <p
          className="mb-8 flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-paper/70 uppercase md:mb-10"
          style={fade(100)}
        >
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
          {site.role}
        </p>

        <RevealLines
          as="h1"
          show={ready}
          delay={150}
          stagger={110}
          className="max-w-[14ch] text-[clamp(3rem,9.6vw,10.5rem)] leading-[0.88] font-medium tracking-[-0.055em]"
          lines={[
            <>Editing that</>,
            <>
              makes brands <em className="accent pr-[0.06em] text-accent">hard</em>
            </>,
            <>to scroll past.</>,
          ]}
        />

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-base leading-relaxed text-paper/70 md:text-lg" style={fade(550)}>
            I turn raw footage into commercials, social content and films people actually watch to the end, with
            5+ years of cutting, grading and sound design behind every frame.
          </p>
          <div className="flex flex-wrap items-center gap-3" style={fade(700)}>
            <MagneticButton onClick={onPlayReel} cursor="Play">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper transition-colors duration-300 group-hover:bg-paper group-hover:text-ink">
                <PlayIcon className="ml-px h-2.5 w-2.5" />
              </span>
              Watch showreel
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              href="#work"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#work')
              }}
            >
              See the work <Arrow className="rotate-135 transition-transform duration-500 ease-expo group-hover:translate-y-0.5" />
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Bottom status bar, like a monitor overlay */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-[1600px] items-center justify-between border-t border-line px-5 py-4 font-mono text-[11px] tracking-[0.14em] text-mute uppercase md:px-10"
        style={fade(850)}
      >
        <span ref={timecodeRef} className="tabular-nums text-paper/80">
          TC {toTimecode(0)}
        </span>
        <span className="hidden md:inline">4K · 25 fps · Rec.709</span>
        <span className="flex items-center gap-3">
          Scroll
          <span className="relative h-6 w-px overflow-hidden bg-line">
            <span className="absolute inset-x-0 top-0 h-2 animate-[scroll-cue_1.8s_var(--ease-expo)_infinite] bg-paper" />
          </span>
        </span>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import logo from '../logo/sharif-vision-logo.png'
import { toTimecode } from '../lib/timecode'

const SEEN_KEY = 'sv-intro-seen'

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Opening slate: a timecode runs to the end of the "intro clip", then the curtain lifts.
 * Plays in full once per browser session; repeat visits get a short version.
 */
export default function Preloader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduced ? 200 : readSeen() ? 700 : 2000
    const start = performance.now()
    let raf = 0
    let exitTimer = 0
    let doneTimer = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // Ease-in-out so the counter accelerates, then settles on the final frame.
      setProgress(t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
        return
      }
      try {
        sessionStorage.setItem(SEEN_KEY, '1')
      } catch {
        /* storage unavailable: intro simply replays */
      }
      exitTimer = window.setTimeout(() => {
        setLeaving(true)
        onReveal()
        doneTimer = window.setTimeout(onDone, 1100)
      }, 250)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onReveal, onDone])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col bg-ink transition-transform duration-[1100ms] ease-curtain ${
        leaving ? '-translate-y-full' : ''
      }`}
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="relative overflow-hidden">
          <img
            src={logo}
            alt="Sharif Vision"
            className="w-[min(70vw,420px)]"
            style={{ clipPath: `inset(0 ${100 - Math.min(100, progress * 140)}% 0 0)` }}
          />
        </div>
      </div>

      <div className="flex items-end justify-between gap-6 px-6 pb-8 font-mono text-xs tracking-[0.14em] text-mute uppercase md:px-12 md:pb-10">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-accent" /> Rec
          </span>
          <span className="text-2xl tracking-normal text-paper tabular-nums md:text-4xl">
            {toTimecode(progress * 5.04)}
          </span>
        </div>
        <span className="tabular-nums">{String(Math.round(progress * 100)).padStart(3, '0')}%</span>
      </div>

      <div className="h-px w-full bg-line">
        <div className="h-full bg-accent" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  )
}

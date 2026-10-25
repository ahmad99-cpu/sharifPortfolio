import { useEffect, useRef, useState } from 'react'
import { stats } from '../data/content'
import { useInView } from '../lib/hooks'
import { Reveal } from './ui/Reveal'

function Counter({ value, suffix, start }: { value: number; suffix: string; start: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!start) return
    const duration = 1800
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration)
      setN(Math.round(value * (1 - Math.pow(1 - t, 4))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, value])

  return (
    <span className="tabular-nums">
      {n}
      <span className="text-accent">{suffix}</span>
    </span>
  )
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32">
      <div ref={ref} className="grid grid-cols-2 border-t border-l border-line lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 90}
            className="group relative flex flex-col justify-between gap-12 overflow-hidden border-r border-b border-line p-5 md:min-h-64 md:p-8"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-bottom scale-y-0 bg-ink-2 transition-transform duration-700 ease-expo group-hover:scale-y-100"
            />
            <span className="relative font-mono text-[11px] tracking-[0.14em] text-mute">0{i + 1}</span>
            <div className="relative">
              <p className="text-[clamp(2.75rem,6vw,5.5rem)] leading-none font-medium tracking-[-0.05em]">
                <Counter value={s.value} suffix={s.suffix} start={inView} />
              </p>
              <p className="mt-3 text-sm text-mute transition-colors duration-500 group-hover:text-paper">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

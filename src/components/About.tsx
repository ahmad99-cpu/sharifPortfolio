import { useRef } from 'react'
import { site, tools } from '../data/content'
import { useInView } from '../lib/hooks'
import { Reveal, RevealLines } from './ui/Reveal'

function RotatingBadge() {
  const text = 'Video editor • Colorist • Storyteller • '
  return (
    <div className="absolute -bottom-10 -left-6 h-32 w-32 md:-bottom-12 md:-left-12 md:h-40 md:w-40" aria-hidden>
      <svg viewBox="0 0 100 100" className="h-full w-full animate-[spin-slow_18s_linear_infinite]">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="var(--color-ink)" />
        <text className="fill-paper font-mono text-[8.4px] tracking-[0.2em] uppercase">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl leading-none font-medium tracking-[-0.04em] md:text-4xl">
          5<span className="text-accent">+</span>
        </span>
        <span className="font-mono text-[9px] tracking-[0.14em] text-mute uppercase">Years</span>
      </div>
    </div>
  )
}

export default function About() {
  const imgRef = useRef<HTMLDivElement>(null)
  const imgIn = useInView(imgRef)

  return (
    <section id="about" className="border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-20 px-5 py-24 md:px-10 md:py-36 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div ref={imgRef} className="group relative mx-auto max-w-md lg:mx-0">
            <div
              className={`overflow-hidden rounded-xl transition-[clip-path] duration-[1600ms] ease-curtain ${
                imgIn ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(100%_0_0_0)]'
              }`}
            >
              <img
                src={site.portrait}
                alt={`Portrait of ${site.name}`}
                loading="lazy"
                className={`aspect-[3/4] w-full object-cover grayscale transition-[filter,transform] duration-[1600ms] ease-expo group-hover:scale-[1.03] group-hover:grayscale-0 ${
                  imgIn ? 'scale-100' : 'scale-125'
                }`}
              />
            </div>
            <RotatingBadge />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-10 lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-mute uppercase">
              <span className="text-accent">04</span>
              <span className="h-px w-8 bg-line" />
              About
            </p>
          </Reveal>

          <RevealLines
            className="text-[clamp(2rem,4.4vw,4rem)] leading-[1.02] font-medium tracking-[-0.04em]"
            lines={[
              <>I turn raw footage</>,
              <>
                into <em className="accent text-accent">moments of magic,</em>
              </>,
              <>on deadline and on brief.</>,
            ]}
          />

          <Reveal delay={150}>
            <div className="grid gap-6 text-base leading-relaxed text-mute md:grid-cols-2 md:text-lg">
              <p>
                I'm Sharif, a video editor with more than five years of experience shaping commercials, social campaigns
                and long-form stories for brands and creators.
              </p>
              <p>
                I care about pacing, sound and color as much as the cut itself, and about being the editor you never
                have to chase: clear updates, clean files, on time.
              </p>
            </div>
          </Reveal>

          <Reveal delay={250}>
            <p className="mb-4 font-mono text-[11px] tracking-[0.14em] text-mute uppercase">Toolkit</p>
            <ul className="flex flex-wrap gap-2">
              {tools.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line px-4 py-2 text-sm text-paper/80 transition-[border-color,color,transform] duration-500 ease-expo hover:-translate-y-0.5 hover:border-accent hover:text-paper"
                >
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

import { useRef, useState, type CSSProperties } from 'react'
import { process, services } from '../data/content'
import { useInView } from '../lib/hooks'
import { Reveal } from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

function ServiceRow({ title, body, index }: { title: string; body: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal delay={index * 70}>
      <div
        className="group relative overflow-hidden border-b border-line"
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
      >
        {/* Accent wipe that floods the row from the left */}
        <span
          aria-hidden
          className={`absolute inset-0 origin-left bg-accent transition-transform duration-700 ease-expo ${open ? 'scale-x-100' : 'scale-x-0'}`}
        />
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`relative flex w-full items-center gap-5 py-7 text-left transition-[color,padding] duration-500 ease-expo md:gap-10 md:py-9 ${
            open ? 'text-ink md:px-6' : 'text-paper'
          }`}
        >
          <span className={`font-mono text-xs transition-colors duration-500 ${open ? 'text-ink/75' : 'text-accent'}`}>
            0{index + 1}
          </span>
          <span className="flex-1 text-[clamp(1.6rem,4.2vw,3.75rem)] leading-none font-medium tracking-[-0.04em]">{title}</span>
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-[transform,border-color] duration-700 ease-expo md:h-14 md:w-14 ${
              open ? 'rotate-45 border-ink/30' : 'border-line'
            }`}
            aria-hidden
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </button>
        <div
          className={`relative grid transition-[grid-template-rows] duration-700 ease-expo ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            <p className="max-w-xl pb-8 pl-9 text-base leading-relaxed text-ink md:pb-10 md:pl-[4.5rem] md:text-lg">{body}</p>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

export default function Services() {
  const processRef = useRef<HTMLOListElement>(null)
  const processIn = useInView(processRef)

  return (
    <section id="services" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
      <SectionHeader
        index="03"
        label="Services"
        title={[
          <>What I bring</>,
          <>
            to the <em className="accent text-accent">timeline.</em>
          </>,
        ]}
      />

      <div className="mt-14 border-t border-line md:mt-20">
        {services.map((s, i) => (
          <ServiceRow key={s.title} title={s.title} body={s.body} index={i} />
        ))}
      </div>

      <div className="mt-28 md:mt-40">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-mute uppercase">How we'll work</p>
        </Reveal>
        <ol ref={processRef} data-in={processIn} className="relative mt-10 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* A track that draws across like a timeline as the steps come in */}
          <span aria-hidden className="absolute top-[7px] right-0 left-0 hidden h-px bg-line md:block" />
          <span
            aria-hidden
            className={`absolute top-[7px] left-0 hidden h-px bg-accent transition-[width] duration-[1800ms] ease-expo md:block ${
              processIn ? 'w-full' : 'w-0'
            }`}
          />
          {process.map((p, i) => (
            <li
              key={p.step}
              className={`relative flex flex-col gap-4 pl-8 transition-[opacity,transform] duration-1000 ease-expo md:pl-0 ${
                processIn ? 'opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${200 + i * 220}ms` } as CSSProperties}
            >
              <span className="absolute top-0 left-0 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-accent bg-ink md:relative">
                <span className="h-[5px] w-[5px] rounded-full bg-accent" />
              </span>
              <p className="font-mono text-[11px] text-mute">Step 0{i + 1}</p>
              <h3 className="text-2xl font-medium tracking-[-0.03em] md:text-3xl">{p.step}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-mute">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

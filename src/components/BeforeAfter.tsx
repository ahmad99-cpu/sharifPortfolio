import { useState } from 'react'
import { comparisons } from '../data/content'
import BeforeAfterSlider from './BeforeAfterSlider'
import { Reveal } from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

export default function BeforeAfter() {
  const [active, setActive] = useState(0)
  const current = comparisons[active]

  return (
    <section id="before-after" className="relative border-t border-line bg-ink-2 py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionHeader
          index="02"
          label="Before / After"
          title={[
            <>The difference</>,
            <>
              is in the <em className="accent text-accent">finish.</em>
            </>,
          ]}
          aside={
            <p className="text-base leading-relaxed text-mute">
              Drag the handle across the frame to see the camera original against the final grade. Use the arrow keys
              if you prefer.
            </p>
          }
        />

        <div className="mt-14 grid grid-cols-1 gap-8 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <Reveal className="min-w-0 lg:col-span-4">
            <div
              role="tablist"
              aria-label="Comparisons"
              className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-line lg:px-0"
            >
              {comparisons.map((c, i) => {
                const selected = i === active
                return (
                  <button
                    key={c.title}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="comparison-panel"
                    onClick={() => setActive(i)}
                    className={`group relative flex shrink-0 items-center gap-4 rounded-full border px-4 py-2.5 text-left transition-colors duration-500 lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-6 ${
                      selected ? 'border-paper bg-paper text-ink lg:bg-transparent lg:text-paper' : 'border-line text-paper/60 hover:text-paper'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute bottom-[-1px] left-0 hidden h-px bg-accent transition-[width] duration-700 ease-expo lg:block ${
                        selected ? 'w-full' : 'w-0 group-hover:w-1/4'
                      }`}
                    />
                    <span className={`hidden font-mono text-[11px] lg:inline ${selected ? 'text-accent' : 'text-mute'}`}>
                      0{i + 1}
                    </span>
                    <span className="flex-1 text-sm whitespace-nowrap lg:text-2xl lg:tracking-[-0.03em] lg:whitespace-normal">
                      {c.title}
                    </span>
                    <span className="hidden font-mono text-[10px] tracking-[0.14em] text-mute uppercase xl:inline">{c.tag}</span>
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden
                      className={`hidden h-3.5 w-3.5 transition-transform duration-500 ease-expo lg:block ${
                        selected ? 'translate-x-0 text-accent' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                      }`}
                      fill="none"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={150} className="min-w-0 lg:col-span-8">
            <div id="comparison-panel" role="tabpanel" aria-label={current.title}>
              <div key={active} className="fade-in">
                <BeforeAfterSlider comparison={current} />
                <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-10">
                  <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">{current.tag}</p>
                  <p className="max-w-xl text-sm leading-relaxed text-mute md:text-base">{current.description}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { site } from '../data/content'
import { Reveal, RevealLines } from './ui/Reveal'
import MagneticButton, { Arrow } from './ui/MagneticButton'

const mailto = `mailto:${site.email}?subject=${encodeURIComponent('New project inquiry')}`

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      {/* Soft accent glow behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />

      <div className="relative mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <Reveal>
          <p className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-mute uppercase">
            <span className="text-accent">05</span>
            <span className="h-px w-8 bg-line" />
            Contact
          </p>
        </Reveal>

        <RevealLines
          className="mt-8 text-[clamp(3rem,10vw,11rem)] leading-[0.86] font-medium tracking-[-0.055em]"
          lines={[
            <>Let's make</>,
            <>
              something <em className="accent text-accent">worth</em>
            </>,
            <>watching.</>,
          ]}
        />

        <div className="mt-16 grid grid-cols-1 gap-16 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-10 lg:col-span-6">
            <Reveal>
              <p className="max-w-md text-lg leading-relaxed text-mute">
                Tell me about the project, the deadline and where it will live. I reply within one business day.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <p className="mb-3 font-mono text-[11px] tracking-[0.14em] text-mute uppercase">Email</p>
              <button
                type="button"
                onClick={copyEmail}
                data-cursor={copied ? 'Copied' : 'Copy'}
                className="group flex flex-wrap items-center gap-x-4 gap-y-3 text-left"
              >
                <span className="link-line pb-1 text-[clamp(1.25rem,2.4vw,2.5rem)] tracking-[-0.03em] whitespace-nowrap">
                  {site.email}
                </span>
                <span
                  className={`flex h-10 shrink-0 items-center gap-2 overflow-hidden rounded-full border px-3 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors duration-500 ${
                    copied ? 'border-accent bg-accent text-ink' : 'border-line text-mute group-hover:border-paper/40 group-hover:text-paper'
                  }`}
                  aria-live="polite"
                >
                  {copied ? (
                    <>
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden>
                        <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    'Copy'
                  )}
                </span>
              </button>
            </Reveal>

            <Reveal delay={200}>
              <MagneticButton href={mailto} cursor="Email">
                Email me
                <span className="relative h-3.5 w-3.5 overflow-hidden">
                  <Arrow className="absolute inset-0 transition-transform duration-500 ease-expo group-hover:translate-x-4 group-hover:-translate-y-4" />
                  <Arrow className="absolute inset-0 -translate-x-4 translate-y-4 transition-transform duration-500 ease-expo group-hover:translate-x-0 group-hover:translate-y-0" />
                </span>
              </MagneticButton>
            </Reveal>
          </div>

          <Reveal delay={150} className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <dl className="flex flex-col text-base">
              <div className="flex items-baseline justify-between gap-6 border-t border-line py-6">
                <dt className="font-mono text-[11px] tracking-[0.14em] text-mute uppercase">Phone</dt>
                <dd>
                  <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`} className="link-line">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-t border-line py-6">
                <dt className="font-mono text-[11px] tracking-[0.14em] text-mute uppercase">Based</dt>
                <dd className="text-right">{site.location}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-y border-line py-6">
                <dt className="font-mono text-[11px] tracking-[0.14em] text-mute uppercase">Availability</dt>
                <dd className="flex items-center gap-2 text-right">
                  <span className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {site.availability}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

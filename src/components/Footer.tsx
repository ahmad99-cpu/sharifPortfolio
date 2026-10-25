import { useRef } from 'react'
import { site } from '../data/content'
import { useInView, useMagnetic } from '../lib/hooks'
import { scrollToTarget } from '../lib/scroll'
import logo from '../logo/sharif-vision-logo.png'

export default function Footer() {
  const logoRef = useRef<HTMLDivElement>(null)
  const logoIn = useInView(logoRef, { rootMargin: '0px' })
  const topRef = useMagnetic<HTMLButtonElement>(0.4)

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-[1600px] px-5 pt-16 pb-8 md:px-10 md:pt-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center gap-1.5 text-lg tracking-tight">
                  <span className="link-line">{s.label}</span>
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3 text-accent transition-transform duration-500 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    fill="none"
                    aria-hidden
                  >
                    <path d="M4 12L12 4M12 4H6M12 4v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>

          <button
            ref={topRef}
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-full border border-line text-xs transition-[border-color,background-color,color,transform] duration-500 ease-expo hover:border-accent hover:bg-accent hover:text-ink"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:-translate-y-1" fill="none" aria-hidden>
              <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to top
          </button>
        </div>

        <div ref={logoRef} className="mt-20 overflow-hidden md:mt-28">
          <img
            src={logo}
            alt={site.name}
            className={`w-full transition-[transform,opacity] duration-[1600ms] ease-expo ${logoIn ? 'translate-y-0 opacity-100' : 'translate-y-1/2 opacity-0'}`}
          />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[11px] tracking-[0.12em] text-mute uppercase md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>{site.role}</span>
          <a href={`mailto:${site.email}`} className="link-line w-fit normal-case">
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  )
}

import { useEffect, useState, type CSSProperties, type MouseEvent } from 'react'
import { site } from '../data/content'
import { scrollToTarget, setScrollLocked } from '../lib/scroll'
import logo from '../logo/sharif-vision-logo.png'
import MagneticButton, { Arrow } from './ui/MagneticButton'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Before / After', href: '#before-after' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
]

export default function Nav({ ready }: { ready: boolean }) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  // Hide on scroll down, reveal on scroll up; track page progress for the timeline bar.
  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        const max = document.documentElement.scrollHeight - window.innerHeight
        setScrolled(y > 40)
        setHidden(y > 300 && y > last + 2)
        if (y < last - 2) setHidden(false)
        setProgress(max > 0 ? y / max : 0)
        last = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    setScrollLocked(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setScrollLocked(false)
    }
  }, [menuOpen])

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault()
    setMenuOpen(false)
    // Let the menu start closing before the page glides away.
    window.setTimeout(() => scrollToTarget(href), menuOpen ? 350 : 0)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,opacity] duration-700 ease-expo ${
          hidden && !menuOpen ? '-translate-y-full' : ''
        } ${ready ? 'opacity-100' : '-translate-y-6 opacity-0'}`}
      >
        <div
          className={`transition-[background-color,backdrop-filter,border-color] duration-500 ${
            scrolled && !menuOpen ? 'border-b border-line bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'
          }`}
        >
          <nav className="mx-auto flex h-18 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10">
            <a href="#top" onClick={go('#top')} aria-label="Sharif Vision — back to top" className="relative z-10">
              <img src={logo} alt="" className="h-6 w-auto md:h-7" />
            </a>

            <ul className="hidden items-center gap-9 lg:flex">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={go(l.href)}
                    className={`group flex items-center gap-2 text-sm transition-colors duration-300 ${
                      active === l.href ? 'text-paper' : 'text-paper/55 hover:text-paper'
                    }`}
                  >
                    <span
                      className={`h-1 w-1 rounded-full bg-accent transition-transform duration-500 ease-expo ${
                        active === l.href ? 'scale-100' : 'scale-0'
                      }`}
                    />
                    <span className="roll">
                      <span>
                        <span>{l.label}</span>
                        <span aria-hidden>{l.label}</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <span className="hidden items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-mute uppercase xl:flex">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-accent" />
                Available
              </span>
              <span className="hidden sm:block">
                <MagneticButton href="#contact" onClick={go('#contact')} className="!px-5 !py-2.5">
                  Start a project <Arrow />
                </MagneticButton>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="relative z-10 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-line lg:hidden"
              >
                <span
                  className={`h-px w-4.5 bg-paper transition-transform duration-500 ease-expo ${menuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`}
                />
                <span
                  className={`h-px w-4.5 bg-paper transition-transform duration-500 ease-expo ${menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`}
                />
              </button>
            </div>
          </nav>
        </div>

        {/* Timeline-style scroll progress with a playhead */}
        <div className="relative h-px w-full" aria-hidden>
          <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${progress * 100}%` }} />
          <div
            className={`absolute -top-[3px] h-[7px] w-px bg-accent transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`}
            style={{ left: `${progress * 100}%` }}
          />
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-ink transition-[clip-path] duration-700 ease-curtain lg:hidden ${
          menuOpen ? '[clip-path:inset(0_0_0_0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]'
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="mt-28 flex flex-col gap-1 px-5" data-in={menuOpen}>
          {[...links, { label: 'Contact', href: '#contact' }].map((l, i) => (
            <li key={l.href} className="line-mask">
              <a
                href={l.href}
                onClick={go(l.href)}
                tabIndex={menuOpen ? 0 : -1}
                className="flex items-baseline gap-4 py-1 text-[clamp(2.5rem,11vw,4.5rem)] leading-none font-medium tracking-[-0.04em]"
                style={{ '--d': `${150 + i * 60}ms` } as CSSProperties}
              >
                <span className="font-mono text-xs tracking-normal text-accent">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-2 border-t border-line px-5 py-8 text-sm text-mute">
          <a href={`mailto:${site.email}`} className="text-paper" tabIndex={menuOpen ? 0 : -1}>
            {site.email}
          </a>
          <span>{site.availability}</span>
        </div>
      </div>
    </>
  )
}

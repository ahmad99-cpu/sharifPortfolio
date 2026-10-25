import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { categories, projects, type Project } from '../data/content'
import { useInView } from '../lib/hooks'
import { formatViews, projectThumbnail, youtubeThumb } from '../lib/media'
import SectionHeader from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { PlayIcon } from './ui/MagneticButton'

const filters = ['All', ...categories] as const
type Filter = (typeof filters)[number]

// Alternating wide/narrow rhythm so the grid reads like an edit, not a spreadsheet.
const spans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-5', 'md:col-span-7', 'md:col-span-6', 'md:col-span-6']

/** "👁 2.4M views" pill: counts up when it scrolls into view and lights up with the card on hover. */
function ViewCount({ views }: { views: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reduced ? 0 : 1600
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = duration ? Math.min(1, (now - t0) / duration) : 1
      setShown(views * (1 - Math.pow(1 - t, 4)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, views])

  return (
    <span
      ref={ref}
      aria-label={`${formatViews(views)} views`}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-paper/15 bg-ink/50 py-1.5 pr-3 pl-2.5 font-mono text-[11px] text-paper tabular-nums backdrop-blur-md transition-[background-color,border-color,color] duration-500 ease-expo group-hover:border-accent group-hover:bg-accent group-hover:text-ink"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path
          d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        {/* Pupil glances sideways on hover */}
        <circle
          cx="8"
          cy="8"
          r="1.9"
          fill="currentColor"
          className="transition-transform duration-500 ease-expo group-hover:translate-x-[1.6px]"
        />
      </svg>
      <span aria-hidden>{formatViews(Math.round(shown))}</span>
      <span aria-hidden className="text-paper/50 transition-colors duration-500 group-hover:text-ink/75">
        views
      </span>
    </span>
  )
}

interface WorkCardProps {
  project: Project
  index: number
  /** Last card with no partner in its row: it spans the full width instead of leaving a gap. */
  alone: boolean
  onOpen: () => void
}

function WorkCard({ project, index, alone, onOpen }: WorkCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)
  const preview = project.preview ?? (project.media.type === 'video' ? project.media.src : undefined)
  const thumb = projectThumbnail(project)
  // With no thumbnail, the paused video itself doubles as the poster frame.
  const videoIsPoster = !thumb && !!preview
  const posterTime = 0.8

  const start = () => {
    setHovered(true)
    const v = videoRef.current
    if (v) v.play().catch(() => {})
  }
  const stop = () => {
    setHovered(false)
    const v = videoRef.current
    if (v) {
      v.pause()
      v.currentTime = videoIsPoster ? posterTime : 0
    }
  }

  return (
    <article
      className={`card-in col-span-12 ${alone ? '' : spans[index % spans.length]}`}
      style={{ '--d': `${index * 80}ms` } as CSSProperties}
    >
      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={start}
        onPointerLeave={stop}
        onFocus={start}
        onBlur={stop}
        data-cursor="Play"
        aria-label={`Play ${project.title} for ${project.client}`}
        className="group block w-full text-left"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink-3 md:aspect-auto md:h-[clamp(320px,36vw,560px)]">
          {thumb && (
            <img
              src={thumb}
              alt=""
              loading="lazy"
              onError={(e) => {
                // Not every YouTube video has a max-res thumbnail.
                if (project.media.type === 'youtube') e.currentTarget.src = youtubeThumb(project.media.id, 'hqdefault')
              }}
              className="absolute inset-0 h-full w-full scale-[1.02] object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.08]"
            />
          )}
          {preview && (
            <video
              ref={videoRef}
              src={videoIsPoster ? `${preview}#t=${posterTime}` : preview}
              muted
              loop
              playsInline
              preload={videoIsPoster ? 'metadata' : 'none'}
              aria-hidden
              className={`absolute inset-0 h-full w-full scale-[1.02] object-cover transition-[opacity,transform] duration-[1400ms] ease-expo group-hover:scale-[1.08] ${
                hovered || videoIsPoster ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30 transition-opacity duration-700 group-hover:opacity-60" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 md:p-5">
            <span className="rounded-full border border-paper/20 bg-ink/40 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-paper/90 uppercase backdrop-blur-md">
              {project.category}
            </span>
            <span className="flex items-center gap-2 font-mono text-[11px] text-paper/80 tabular-nums">
              {project.media.type === 'youtube' && (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-label="YouTube">
                  <path
                    fill="currentColor"
                    d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"
                  />
                </svg>
              )}
              {project.duration}
            </span>
          </div>

          {/* Touch devices get a visible play affordance since there's no hover. */}
          <span className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink [@media(pointer:fine)]:hidden">
            <PlayIcon className="ml-0.5 h-4 w-4" />
          </span>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-6">
            <div className="min-w-0">
              <h3 className="truncate text-2xl font-medium tracking-[-0.03em] md:text-4xl">{project.title}</h3>
              <p className="mt-1 truncate text-sm text-paper/60">
                {project.client}
                {project.views !== undefined && <span className="text-paper/40"> · {project.year}</span>}
              </p>
            </div>
            {project.views !== undefined ? (
              <ViewCount views={project.views} />
            ) : (
              <span className="font-mono text-[11px] text-paper/60">{project.year}</span>
            )}
          </div>
        </div>
      </button>

      <div className="mt-4 flex items-center justify-between gap-4 overflow-hidden text-sm text-mute">
        <span className="truncate">{project.role}</span>
        <span className="font-mono text-[11px] text-paper/30">{String(index + 1).padStart(2, '0')}</span>
      </div>
    </article>
  )
}

export default function Work({ onOpen }: { onOpen: (project: Project) => void }) {
  const [filter, setFilter] = useState<Filter>('All')
  const tabsRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const gridRef = useRef<HTMLDivElement>(null)
  const gridInView = useInView(gridRef, { rootMargin: '0px 0px -8% 0px' })

  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const available = filters.filter((f) => f === 'All' || projects.some((p) => p.category === f))

  // Slide the highlight pill under the active filter.
  useLayoutEffect(() => {
    const measure = () => {
      const el = tabsRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [filter])

  return (
    <section id="work" className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
      <SectionHeader
        index="01"
        label="Selected work"
        title={[
          <>
            Cuts that <em className="accent text-accent">move</em>
          </>,
          <>people to act.</>,
        ]}
        aside={
          <p className="text-base leading-relaxed text-mute">
            A selection of commercials, social campaigns and long-form edits. Hover to preview, click to watch.
          </p>
        }
      />

      <Reveal delay={100} className="mt-14 md:mt-20">
        <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
          <div ref={tabsRef} className="relative inline-flex gap-1 rounded-full border border-line p-1">
            <span
              aria-hidden
              className="absolute top-1 bottom-1 rounded-full bg-paper transition-[left,width] duration-500 ease-expo"
              style={{ left: indicator.left, width: indicator.width }}
            />
            {available.map((f) => {
              const count = f === 'All' ? projects.length : projects.filter((p) => p.category === f).length
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300 md:px-5 ${
                    filter === f ? 'text-ink' : 'text-paper/60 hover:text-paper'
                  }`}
                >
                  {f}
                  <sup className="font-mono text-[9px] opacity-60">{count}</sup>
                </button>
              )
            })}
          </div>
        </div>
      </Reveal>

      <div ref={gridRef} data-in={gridInView} className="mt-8 grid grid-cols-12 gap-x-4 gap-y-12 md:mt-10 md:gap-x-6 md:gap-y-16">
        {visible.map((p, i) => (
          <WorkCard
            key={`${filter}-${p.title}`}
            project={p}
            index={i}
            alone={i % 2 === 0 && i === visible.length - 1}
            onOpen={() => onOpen(p)}
          />
        ))}
      </div>
    </section>
  )
}

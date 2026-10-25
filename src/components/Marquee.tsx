import { marquee } from '../data/content'

function Row() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {marquee.map((item, i) => (
        <span key={item} className="flex items-center">
          <span
            className={`px-6 text-[clamp(2.25rem,6vw,5.5rem)] leading-none tracking-[-0.04em] transition-colors duration-500 md:px-10 ${
              i % 2 ? 'font-serif text-paper/90 italic hover:text-accent' : 'font-medium text-transparent [-webkit-text-stroke:1px_rgb(238_235_229/0.45)] hover:text-paper'
            }`}
          >
            {item}
          </span>
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent md:h-7 md:w-7">
            <path d="M12 0c.8 6.2 1.8 10.2 12 12-10.2 1.8-11.2 5.8-12 12-.8-6.2-1.8-10.2-12-12C10.2 10.2 11.2 6.2 12 0z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  )
}

/** Endless band of the services, two copies side by side so the loop never shows a seam. */
export default function Marquee() {
  return (
    <section className="marquee relative overflow-hidden border-y border-line py-8 md:py-12">
      <p className="sr-only">{marquee.join(', ')}</p>
      <div className="marquee-track flex w-max">
        <Row />
        <Row />
      </div>
    </section>
  )
}

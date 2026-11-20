import { useEffect, useRef, useState } from 'react'
import type { Media } from '../data/content'
import { youtubeBackgroundEmbed, youtubeThumb } from '../lib/media'

// Oversize the embed slightly so YouTube's edge UI (title bar, logo) falls outside the frame.
const YT_OVERSCAN = 1.2
// YouTube gives no "playing" signal without its JS API, so fade in after the player has had time to start.
const YT_FADE_DELAY_MS = 1600

interface HeroBackgroundProps {
  media: Media
  className?: string
}

/** Full-bleed muted loop behind the hero: a self-hosted video or a YouTube embed sized to "cover". */
export default function HeroBackground({ media, className = '' }: HeroBackgroundProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [playing, setPlaying] = useState(false)

  // Size a 16:9 frame that always covers the box, like object-fit: cover.
  useEffect(() => {
    if (media.type !== 'youtube') return
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const w = Math.max(width, (height * 16) / 9) * YT_OVERSCAN
      setSize({ w, h: (w * 9) / 16 })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [media.type])

  if (media.type === 'video') {
    return (
      <video
        className={`h-full w-full object-cover ${className}`}
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
    )
  }

  return (
    <div ref={boxRef} className={`relative h-full w-full overflow-hidden ${className}`} aria-hidden>
      {/* Poster shown until the embed is playing */}
      <img
        src={youtubeThumb(media.id)}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? 'opacity-0' : 'opacity-100'}`}
      />
      {size.w > 0 && (
        <iframe
          src={youtubeBackgroundEmbed(media.id)}
          title="Showreel background"
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          onLoad={() => window.setTimeout(() => setPlaying(true), YT_FADE_DELAY_MS)}
          className={`pointer-events-none absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-1000 ${
            playing ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ width: size.w, height: size.h }}
        />
      )}
    </div>
  )
}

import { useEffect, useRef, useState, type RefObject } from 'react'
import { videoClip, youtubeClip, type Clip } from '../lib/compare'
import { youtubeThumb } from '../lib/media'
import { clipPlayerVars, loadYouTubeApi, type YTPlayer } from '../lib/youtube'

interface ClipSourceProps {
  /** 'video' plays a file URL; 'youtube' plays a YouTube video id. */
  kind: 'video' | 'youtube'
  src: string
  poster?: string
  clipRef: RefObject<Clip | null>
  className?: string
}

/** Fills its parent with a muted, page-controlled clip and publishes it through `clipRef`. */
export default function ClipSource({ kind, src, poster, clipRef, className = 'h-full w-full object-cover' }: ClipSourceProps) {
  if (kind === 'youtube') return <YouTubeClip id={src} poster={poster ?? youtubeThumb(src)} clipRef={clipRef} />
  return (
    <video
      ref={(el) => void (clipRef.current = el && videoClip(el))}
      src={src}
      poster={poster}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  )
}

// YouTube's embed always flashes its own play controls when playback starts, resumes or seeks, and
// the API can't turn them off. The still covers the player from that moment until they've faded.
const CONTROLS_VISIBLE_MS = 4000
// Safety net in case YouTube never reports "playing" (e.g. a seek inside already-buffered video).
const COVER_FALLBACK_MS = 5000

function YouTubeClip({ id, poster, clipRef }: { id: string; poster: string; clipRef: RefObject<Clip | null> }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [covered, setCovered] = useState(true)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let cancelled = false
    let player: YTPlayer | null = null
    let ready = false
    let uncoverTimer = 0

    const uncoverAfter = (ms: number) => {
      clearTimeout(uncoverTimer)
      uncoverTimer = window.setTimeout(() => setCovered(false), ms)
    }
    // Cover first, then act, so the controls never get a frame on screen.
    const cover = () => {
      setCovered(true)
      uncoverAfter(COVER_FALLBACK_MS)
    }

    // The API replaces this element with its iframe, so it lives outside React's tree.
    const mount = document.createElement('div')
    host.appendChild(mount)
    const base = youtubeClip(() => (ready ? player : null))
    clipRef.current = {
      ...base,
      play: () => {
        cover()
        base.play()
      },
      seek: (s) => {
        cover()
        base.seek(s)
      },
      // Sync corrections are tiny and mid-playback: no cover, or the frame would blink at random.
      nudge: base.seek,
    }

    loadYouTubeApi().then((YT) => {
      if (cancelled) return
      player = new YT.Player(mount, {
        videoId: id,
        host: 'https://www.youtube-nocookie.com',
        width: '100%',
        height: '100%',
        playerVars: clipPlayerVars(id),
        events: {
          onReady: () => {
            ready = true
            player?.mute()
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) uncoverAfter(CONTROLS_VISIBLE_MS)
          },
        },
      })
    })

    return () => {
      cancelled = true
      clearTimeout(uncoverTimer)
      clipRef.current = null
      player?.destroy()
      host.replaceChildren()
    }
  }, [id, clipRef])

  return (
    <div className="relative h-full w-full overflow-hidden bg-black" aria-hidden>
      {/*
        A portrait iframe makes YouTube switch to its Shorts layout (logo, like/share, title over the video).
        So the player is a landscape 16:9 frame, as tall as this 9:16 box and centered: the vertical video fills
        exactly the visible middle, and the plain player's edge labels fall in the cropped-off sides.
        The page drives playback, so the player never receives pointer events (and never shows hover UI).
      */}
      <div
        ref={hostRef}
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[316.05%] -translate-x-1/2 [&>iframe]:h-full [&>iframe]:w-full"
      />
      {/* Still frame over YouTube's loading screen and its start/resume controls; snaps on, fades off */}
      <img
        src={poster}
        alt=""
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${
          covered ? 'opacity-100' : 'opacity-0 transition-opacity duration-700'
        }`}
      />
    </div>
  )
}

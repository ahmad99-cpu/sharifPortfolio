import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Media, Orientation } from '../data/content'
import { usePresence } from '../lib/hooks'
import { youtubeEmbed } from '../lib/media'
import { setScrollLocked } from '../lib/scroll'

export interface ModalItem {
  media: Media
  title: string
  meta?: string
  orientation?: Orientation
}

interface VideoModalProps {
  /** Stays set after closing so the content remains visible during the exit transition. */
  item: ModalItem | null
  open: boolean
  onClose: () => void
}

export default function VideoModal({ item, open, onClose }: VideoModalProps) {
  const { mounted, visible } = usePresence(open, 600)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    setScrollLocked(true)
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setScrollLocked(false)
      previouslyFocused?.focus({ preventScroll: true })
    }
  }, [open, onClose])

  if (!mounted || !item) return null
  const current = item

  const portrait = current.orientation === 'portrait'

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
    >
      <button
        type="button"
        aria-label="Close video"
        tabIndex={-1}
        onClick={onClose}
        data-cursor="Close"
        className={`absolute inset-0 bg-ink/90 backdrop-blur-xl transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      />

      <div
        className={`relative flex w-full flex-col gap-4 transition-[opacity,transform] duration-700 ease-expo ${
          portrait ? 'max-w-[min(420px,calc(85svh*9/16))]' : 'max-w-6xl'
        } ${visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-[0.96] opacity-0'}`}
      >
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-lg font-medium tracking-tight md:text-2xl">{current.title}</p>
            {current.meta && <p className="mt-1 truncate font-mono text-[11px] tracking-[0.14em] text-mute uppercase">{current.meta}</p>}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="group flex h-11 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm transition-colors hover:border-paper/40"
          >
            Close
            <span className="relative h-3 w-3 transition-transform duration-500 ease-expo group-hover:rotate-90">
              <span className="absolute top-1/2 left-0 h-px w-3 rotate-45 bg-paper" />
              <span className="absolute top-1/2 left-0 h-px w-3 -rotate-45 bg-paper" />
            </span>
          </button>
        </div>

        <div
          data-cursor="hide"
          className={`relative w-full overflow-hidden rounded-xl bg-ink-3 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)] ${
            portrait ? 'aspect-[9/16]' : 'aspect-video'
          }`}
        >
          {/* Unmount the player as soon as the modal closes so playback stops immediately. */}
          {open &&
            (current.media.type === 'youtube' ? (
              <iframe
                src={youtubeEmbed(current.media.id)}
                title={current.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                src={current.media.src}
                poster={current.media.poster}
                className="absolute inset-0 h-full w-full bg-black object-contain"
                controls
                autoPlay
                playsInline
              />
            ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}

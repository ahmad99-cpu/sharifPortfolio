import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from 'react'

import type { YTPlayer } from './youtube'

// Auto-play: the handle glides back and forth until the visitor takes over.
const AUTO_PERIOD_MS = 7000
const AUTO_SWING = 34 // percent either side of center

/** A playable source the comparison can drive: a <video> element or a YouTube player. */
export interface Clip {
  ready(): boolean
  play(): void
  pause(): void
  time(): number
  duration(): number
  seek(seconds: number): void
  /** Small corrective seek used to keep clips aligned; defaults to `seek`. */
  nudge?(seconds: number): void
  setMuted(muted: boolean): void
  /** Drift (s) tolerated before re-syncing, and the minimum gap (ms) between corrective seeks. */
  tolerance: number
  seekGapMs: number
}

export function videoClip(v: HTMLVideoElement): Clip {
  return {
    ready: () => v.readyState >= 1,
    play: () => void v.play().catch(() => {}),
    pause: () => v.pause(),
    time: () => v.currentTime,
    duration: () => v.duration || 0,
    seek: (s) => {
      v.currentTime = s
    },
    setMuted: (m) => {
      v.muted = m
    },
    tolerance: 0.12,
    seekGapMs: 0,
  }
}

/** `get` returns the player once it is ready, null before. YouTube seeks are slow, so correct gently. */
export function youtubeClip(get: () => YTPlayer | null): Clip {
  return {
    ready: () => get() !== null,
    play: () => get()?.playVideo(),
    pause: () => get()?.pauseVideo(),
    time: () => get()?.getCurrentTime() ?? 0,
    duration: () => get()?.getDuration() ?? 0,
    seek: (s) => get()?.seekTo(s, true),
    setMuted: (m) => (m ? get()?.mute() : get()?.unMute()),
    tolerance: 0.15,
    seekGapMs: 1500,
  }
}

/**
 * Plays two clips together while `active`, keeping `follower` locked to `leader`'s clock.
 * Waits for both to be ready, so it works with players that load asynchronously.
 * `onTick(time, duration)` runs every frame while active, e.g. to drive a timeline.
 */
export function useSyncedClips(
  leader: RefObject<Clip | null>,
  follower: RefObject<Clip | null>,
  { active, playing, onTick }: { active: boolean; playing: boolean; onTick?: (time: number, duration: number) => void },
) {
  const tickRef = useRef(onTick)
  useEffect(() => {
    tickRef.current = onTick
  })

  useEffect(() => {
    const want = active && playing
    let applied: boolean | null = null
    let lastSeek = 0
    let raf = 0

    const loop = (now: number) => {
      const a = leader.current
      const b = follower.current
      if (a?.ready() && b?.ready()) {
        if (applied !== want) {
          if (want) {
            a.play()
            b.play()
          } else {
            a.pause()
            b.pause()
          }
          applied = want
        }
        if (want) {
          const drift = Math.abs(b.time() - a.time())
          if (drift > Math.max(a.tolerance, b.tolerance) && now - lastSeek > Math.max(a.seekGapMs, b.seekGapMs)) {
            ;(b.nudge ?? b.seek)(a.time())
            lastSeek = now
          }
        }
        if (active) tickRef.current?.(a.time(), a.duration())
      }
      // Keep running while on screen, or until the paused state has been applied.
      if (active || applied !== want) raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [leader, follower, active, playing])
}

/**
 * Drag/keyboard state for a before/after wipe across `target`.
 * While `enabled` and on screen, the handle glides on its own until the visitor first interacts.
 */
export function useCompareSlider<T extends HTMLElement>(
  target: RefObject<T | null>,
  { enabled = true, inView }: { enabled?: boolean; inView: boolean },
) {
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)
  const [auto, setAuto] = useState(true)
  const draggingRef = useRef(false)
  // Time spent auto-moving, kept across pauses so the motion resumes where it left off.
  const autoElapsed = useRef(0)

  useEffect(() => {
    if (!enabled || !auto || !inView || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let last = performance.now()
    let raf = 0
    const tick = (now: number) => {
      autoElapsed.current += now - last
      last = now
      setPosition(50 + AUTO_SWING * Math.sin((autoElapsed.current / AUTO_PERIOD_MS) * Math.PI * 2))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled, auto, inView])

  const fromPointer = useCallback(
    (clientX: number) => {
      const el = target.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
    },
    [target],
  )

  const endDrag = () => {
    draggingRef.current = false
    setDragging(false)
  }

  const handlers = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if ((e.target as Element).closest('[data-control]')) return
      setAuto(false)
      draggingRef.current = true
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
      fromPointer(e.clientX)
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (draggingRef.current) fromPointer(e.clientX)
    },
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  }

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const step = e.shiftKey ? 10 : 2
    const next = { ArrowLeft: position - step, ArrowRight: position + step, Home: 0, End: 100 }[e.key]
    if (next === undefined) return
    e.preventDefault()
    setAuto(false)
    setPosition(Math.min(100, Math.max(0, next)))
  }

  return { position, dragging, auto, handlers, onKeyDown }
}

import { useEffect, useRef, useState, type RefObject } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** True once the element has entered the viewport (or while it's inside, when `once` is false). */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = true, rootMargin = '0px 0px -12% 0px', threshold = 0 } = {},
) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, rootMargin, threshold])
  return inView
}

/** Pulls an element toward the pointer while hovered. */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])
  return ref
}

/** Keeps a component mounted long enough to play its exit transition. */
export function usePresence(open: boolean, exitMs = 500) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)

  // Adjust state during render so mount/exit start in the same frame as `open` flips.
  if (open && !mounted) setMounted(true)
  if (!open && visible) setVisible(false)

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(raf)
    }
    const t = setTimeout(() => setMounted(false), exitMs)
    return () => clearTimeout(t)
  }, [open, exitMs])

  return { mounted, visible }
}

import Lenis from 'lenis'

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) })
  let raf = requestAnimationFrame(function loop(time) {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  })

  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6 })
    return
  }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

export function setScrollLocked(locked: boolean) {
  if (locked) lenis?.stop()
  else lenis?.start()
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

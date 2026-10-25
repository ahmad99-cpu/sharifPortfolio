import { useEffect, useRef, useState } from 'react'

type Mode = 'default' | 'hover' | 'label' | 'hidden'

const INTERACTIVE = 'a, button, [role="button"], [role="slider"], [role="tab"], input, textarea, select, label'

/**
 * Trailing ring that follows the system crosshair cursor (set in index.css).
 * Add `data-cursor="Play"` to any element to have the ring expand with that label;
 * `data-cursor="hide"` hides it (e.g. over iframes, which swallow pointer events).
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled] = useState(
    () => window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [mode, setMode] = useState<Mode>('hidden')
  const [label, setLabel] = useState('')
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    let raf = 0

    const loop = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
    }

    const onOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null
      const labelled = target?.closest<HTMLElement>('[data-cursor]')
      const value = labelled?.dataset.cursor
      if (value === 'hide') {
        setMode('hidden')
      } else if (value) {
        setLabel(value)
        setMode('label')
      } else if (target?.closest(INTERACTIVE)) {
        setMode('hover')
      } else {
        setMode('default')
      }
    }

    const onLeaveWindow = () => setMode('hidden')
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled])

  if (!enabled) return null

  const ringSize = { default: 34, hover: 56, label: 92, hidden: 0 }[mode]

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <div ref={ringRef} className="absolute top-0 left-0 will-change-transform">
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background-color,border-color,opacity] duration-500 ease-expo ${
            mode === 'label' ? 'border-transparent bg-accent' : 'border border-paper/40 bg-transparent'
          } ${mode === 'hover' ? 'border-paper/80 bg-paper/5' : ''} ${pressed ? 'scale-90' : ''}`}
          style={{ width: ringSize, height: ringSize, opacity: mode === 'hidden' ? 0 : 1 }}
        >
          <span
            className={`font-mono text-[10px] font-medium tracking-[0.14em] text-ink uppercase transition-opacity duration-300 ${
              mode === 'label' ? 'opacity-100 delay-100' : 'opacity-0'
            }`}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}

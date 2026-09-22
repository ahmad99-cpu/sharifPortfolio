import { useCallback, useRef, useState } from 'react'

interface BeforeAfterSliderProps {
  beforeSrc: string
  afterSrc: string
  beforeLabel?: string
  afterLabel?: string
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [position, setPosition] = useState(50)

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPosition(Math.min(100, Math.max(0, pct)))
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    updatePosition(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    updatePosition(e.clientX)
  }

  const stopDragging = () => {
    draggingRef.current = false
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-3/4 w-full max-w-xs touch-none overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.15)] select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <img
        src={beforeSrc}
        alt={beforeLabel}
        className="absolute inset-0 h-full w-full object-cover grayscale"
        draggable={false}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={afterSrc}
          alt={afterLabel}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <span className="absolute top-3 left-3 text-xs font-extrabold tracking-wider text-white uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 text-xs font-extrabold tracking-wider text-white uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
        {afterLabel}
      </span>

      <div
        className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-white/90"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 5L2 12L8 19M16 5L22 12L16 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

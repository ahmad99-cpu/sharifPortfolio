import Sparkle from './Sparkle'

export default function SparkleDivider() {
  return (
    <div className="my-12 flex w-full max-w-2xl items-center">
      <div className="h-px flex-1 bg-white/40" />
      <Sparkle className="mx-2 h-7 w-7 shrink-0" />
      <div className="h-px flex-1 bg-white/40" />
      <Sparkle className="mx-2 h-7 w-7 shrink-0" />
      <div className="h-px flex-1 bg-white/40" />
      <Sparkle className="mx-2 h-7 w-7 shrink-0" />
      <div className="h-px flex-1 bg-white/40" />
    </div>
  )
}

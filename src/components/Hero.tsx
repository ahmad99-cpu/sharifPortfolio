import logo from '../logo/SHARIF_Vision_No_Background.png'

export default function Hero() {
  return (
    <section className="flex min-h-screen flex-col justify-center gap-12 bg-black px-6 py-28 md:flex-row md:items-center md:gap-16 md:px-16">
      <div className="flex flex-col gap-10 md:w-1/2">
        <img src={logo} alt="Sharif Vision" className="w-full max-w-md" />

        <div className="flex items-center gap-4 text-sm font-semibold tracking-[0.3em] text-white/80 uppercase">
          <span>Video Editor</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-1">
            <path
              d="M12 4v14m0 0l-6-6m6 6l6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="md:w-1/2">
        <img
          src="https://placehold.co/700x900/1a1a1a/6b6b6b?text=Portrait"
          alt="Sharif portrait"
          className="aspect-3/4 w-full rounded-3xl object-cover grayscale"
        />
      </div>
    </section>
  )
}

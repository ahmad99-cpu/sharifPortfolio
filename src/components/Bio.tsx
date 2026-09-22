export default function Bio() {
  return (
    <section className="flex flex-col gap-12 bg-black px-6 py-24 md:flex-row md:items-start md:justify-between md:px-16">
      <h2 className="font-display text-5xl leading-[0.95] uppercase sm:text-6xl md:text-7xl">
        Sharif
        <br />
        Vision
      </h2>

      <div className="flex flex-col gap-8 md:max-w-md md:text-right">
        <span className="font-display text-4xl text-white/40 uppercase md:text-5xl">Bio</span>
        <p className="text-lg leading-snug font-medium text-white/90 uppercase sm:text-xl">
          I have over 5 years experience in video editing.
        </p>
        <p className="text-lg leading-snug font-medium text-white/90 uppercase sm:text-xl">
          I turn raw footage into moments of magic.
        </p>
      </div>
    </section>
  )
}

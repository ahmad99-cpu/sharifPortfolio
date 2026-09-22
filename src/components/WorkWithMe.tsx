const contactInfo = [
  { label: 'Address', value: '123 Anywhere St, Any City, ST 12345' },
  { label: 'Phone', value: '(123) 456 7890' },
  { label: 'Email', value: 'sharif.videoeditor@gmail.com' },
]

export default function WorkWithMe() {
  return (
    <section className="flex flex-col gap-20 bg-black px-6 py-24 md:gap-28 md:px-16">
      <h2 className="font-display text-5xl uppercase sm:text-6xl md:text-7xl">Check my work</h2>

      <div className="flex flex-col gap-16">
        <h2 className="bg-gradient-to-b from-white to-white/10 bg-clip-text font-display text-5xl text-transparent uppercase sm:text-6xl md:text-8xl">
          Work with me
        </h2>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {contactInfo.map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-bold tracking-widest text-white/50 uppercase">{label}</p>
              <p className="mt-2 text-base break-words text-white uppercase">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

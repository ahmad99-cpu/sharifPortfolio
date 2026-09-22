import BeforeAfterSlider from './BeforeAfterSlider'
import SparkleDivider from './SparkleDivider'

const projects = [
  {
    before: 'https://placehold.co/600x800/141414/555555?text=Before',
    after: 'https://placehold.co/600x800/2b2b2b/e5e5e5?text=After',
  },
  {
    before: 'https://placehold.co/600x800/141414/555555?text=Before',
    after: 'https://placehold.co/600x800/2b2b2b/e5e5e5?text=After',
  },
  {
    before: 'https://placehold.co/600x800/141414/555555?text=Before',
    after: 'https://placehold.co/600x800/2b2b2b/e5e5e5?text=After',
  },
]

export default function FeaturedWork() {
  return (
    <section className="bg-black px-6 py-24 md:px-16">
      <h2 className="font-script text-5xl text-white sm:text-6xl md:text-7xl">Featured work</h2>

      <div className="mt-16 flex flex-col items-center gap-20">
        {projects.map((project, i) => (
          <div key={i} className="flex w-full flex-col items-center">
            <p className="max-w-xl text-center text-2xl font-semibold sm:text-3xl">
              I can turn raw footage into emotions.
            </p>
            <SparkleDivider />
            <BeforeAfterSlider beforeSrc={project.before} afterSrc={project.after} />
          </div>
        ))}
      </div>
    </section>
  )
}

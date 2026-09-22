import Bio from './components/Bio'
import FeaturedWork from './components/FeaturedWork'
import Hero from './components/Hero'
import WorkWithMe from './components/WorkWithMe'

function App() {
  return (
    <main className="bg-black text-white">
      <Hero />
      <Bio />
      <WorkWithMe />
      <FeaturedWork />
    </main>
  )
}

export default App

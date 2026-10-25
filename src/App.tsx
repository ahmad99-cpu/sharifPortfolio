import { useCallback, useEffect, useState } from 'react'
import About from './components/About'
import BeforeAfter from './components/BeforeAfter'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Nav from './components/Nav'
import Preloader from './components/Preloader'
import Services from './components/Services'
import Stats from './components/Stats'
import VideoModal, { type ModalItem } from './components/VideoModal'
import Work from './components/Work'
import { showreel, site, type Project } from './data/content'
import { formatViews } from './lib/media'
import { initSmoothScroll, setScrollLocked } from './lib/scroll'

function App() {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState<ModalItem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    setScrollLocked(loading)
  }, [loading])

  const reveal = useCallback(() => setReady(true), [])
  const finishLoading = useCallback(() => setLoading(false), [])
  const closeModal = useCallback(() => setModalOpen(false), [])

  const play = (item: ModalItem) => {
    setPlaying(item)
    setModalOpen(true)
  }

  const openProject = (p: Project) =>
    play({
      media: p.media,
      title: p.title,
      meta: [p.client, p.category, p.year, p.views !== undefined && `${formatViews(p.views)} views`].filter(Boolean).join(' · '),
      orientation: p.orientation,
    })

  const openReel = () => play({ media: showreel.full, title: 'Showreel', meta: `${site.name} · ${new Date().getFullYear()}` })

  return (
    <>
      {loading && <Preloader onReveal={reveal} onDone={finishLoading} />}
      <Cursor />
      <div className="grain" aria-hidden />
      <Nav ready={ready} />

      <main>
        <Hero ready={ready} onPlayReel={openReel} />
        <Marquee />
        <Work onOpen={openProject} />
        <Stats />
        <BeforeAfter />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />

      <VideoModal item={playing} open={modalOpen} onClose={closeModal} />
    </>
  )
}

export default App

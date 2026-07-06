import { useEffect, useState } from 'react'
import HeroSection from './components/HeroSection'
import MarqueeSection from './components/MarqueeSection'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import ProjectsSection from './components/ProjectsSection'
import ContactSection from './components/ContactSection'
import FooterSection from './components/FooterSection'
import AllProjectsPage from './components/AllProjectsPage'
import ProjectDetailPage from './components/ProjectDetailPage'

// Lightweight hash router: `#/work` shows the full projects page,
// everything else shows the home page. Works on any static host.
function useHashRoute() {
  const [hash, setHash] = useState(
    typeof window !== 'undefined' ? window.location.hash : '',
  )

  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return hash
}

export default function App() {
  const hash = useHashRoute()

  if (hash.startsWith('#/project/')) {
    const slug = decodeURIComponent(hash.slice('#/project/'.length))
    return (
      <main className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
        <ProjectDetailPage slug={slug} />
        <FooterSection />
      </main>
    )
  }

  if (hash === '#/work') {
    return (
      <main className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
        <AllProjectsPage />
        <FooterSection />
      </main>
    )
  }

  return (
    <main className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
      <FooterSection />
    </main>
  )
}

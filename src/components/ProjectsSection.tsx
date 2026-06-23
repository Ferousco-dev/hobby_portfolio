import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FadeIn from './FadeIn'
import LiveProjectButton from './LiveProjectButton'

interface Project {
  number: string
  category: string
  name: string
  col1: [string, string]
  col2: string
  link?: string
}

const PROJECTS: Project[] = [
  {
    number: '01',
    category: 'Flutter',
    name: 'OraStudy App',
    col1: ['/oratudy/1.webp', '/oratudy/2.webp'],
    col2: '/oratudy/3.webp',
    link: 'https://play.google.com/apps/testing/com.orastudy.orastudy',
  },
  {
    number: '02',
    category: 'Hackathon Winner',
    name: 'TapPay',
    col1: ['/tappay/1.webp', '/tappay/2.webp'],
    col2: '/tappay/3.webp',
    link: 'https://github.com/Ferousco-dev/TapPay',
  },
  {
    number: '03',
    category: 'Hobby · Next.js',
    name: 'Oriente',
    col1: ['/oriente/1.webp', '/oriente/2.webp'],
    col2: '/oriente/3.webp',
    link: 'https://oriente-nu.vercel.app',
  },
]

const CARD_RADIUS =
  'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]'

interface ProjectCardProps {
  project: Project
  index: number
  totalCards: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  range: [number, number]
  targetScale: number
}

function ProjectCard({
  project,
  index,
  progress,
  range,
  targetScale,
}: ProjectCardProps) {
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div className="sticky top-24 md:top-32 h-[85vh] flex items-start justify-center">
      <motion.div
        style={{
          scale,
          top: `${index * 28}px`,
        }}
        className={`relative w-full ${CARD_RADIUS} border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8`}
      >
        {/* Top row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center gap-5 sm:gap-8">
            <span
              className="text-[#D7E2EA] font-black leading-none"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col">
              <span className="text-[#D7E2EA]/60 font-light uppercase tracking-widest text-sm sm:text-base">
                {project.category}
              </span>
              <span className="text-[#D7E2EA] font-medium uppercase text-lg sm:text-2xl md:text-3xl">
                {project.name}
              </span>
            </div>
          </div>
          <LiveProjectButton href={project.link} />
        </div>

        {/* Bottom row — image grid */}
        <div
          className="flex gap-3 sm:gap-4 md:gap-5 overflow-hidden"
          style={{ height: 'clamp(260px, 36vw, 500px)' }}
        >
          {/* Left column 40% */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 w-[40%]">
            <img
              src={project.col1[0]}
              alt={`${project.name} preview 1`}
              loading="lazy"
              className={`w-full object-cover ${CARD_RADIUS}`}
              style={{ height: 'clamp(100px, 11vw, 170px)' }}
            />
            <img
              src={project.col1[1]}
              alt={`${project.name} preview 2`}
              loading="lazy"
              className={`w-full object-cover ${CARD_RADIUS}`}
              style={{ height: 'clamp(190px, 26vw, 390px)' }}
            />
          </div>
          {/* Right column 60% */}
          <div className="w-[60%]">
            <img
              src={project.col2}
              alt={`${project.name} feature`}
              loading="lazy"
              className={`w-full h-full object-cover ${CARD_RADIUS}`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const totalCards = PROJECTS.length

  return (
    <section
      id="projects"
      className="relative z-10 bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-28 pb-20"
    >
      <FadeIn
        as="h2"
        delay={0}
        y={40}
        className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-12 sm:mb-16 md:mb-20"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Project
      </FadeIn>

      <div ref={containerRef} className="max-w-6xl mx-auto">
        {PROJECTS.map((project, index) => {
          const targetScale = 1 - (totalCards - 1 - index) * 0.03
          const rangeStart = index * (1 / totalCards)
          return (
            <ProjectCard
              key={project.number}
              project={project}
              index={index}
              totalCards={totalCards}
              progress={scrollYProgress}
              range={[rangeStart, 1]}
              targetScale={targetScale}
            />
          )
        })}
      </div>
    </section>
  )
}

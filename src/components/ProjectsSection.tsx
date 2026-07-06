import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import FadeIn from './FadeIn'
import LiveProjectButton from './LiveProjectButton'
import { PROJECTS, FEATURED_COUNT, type Project } from '../data/projects'

const CARD_RADIUS = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]'

interface ProjectCardProps {
  project: Project
  index: number
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
            <div className="flex flex-col gap-2">
              <span className="text-[#D7E2EA]/60 font-light uppercase tracking-widest text-sm sm:text-base">
                {project.category}
              </span>
              <span className="text-[#D7E2EA] font-medium uppercase text-lg sm:text-2xl md:text-3xl">
                {project.name}
              </span>
              <div className="hidden sm:flex flex-wrap gap-2 mt-1">
                {project.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-[#D7E2EA]/25 text-[#D7E2EA]/70 px-3 py-1 text-xs font-light uppercase tracking-wider"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {project.link && <LiveProjectButton href={project.link} />}
        </div>

        {/* Single representative image */}
        <div
          className={`overflow-hidden ${CARD_RADIUS}`}
          style={{ height: 'clamp(240px, 34vw, 460px)' }}
        >
          <img
            src={project.image}
            alt={`${project.name} preview`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
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

  const featured = PROJECTS.slice(0, FEATURED_COUNT)
  const totalCards = featured.length

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
        Projects
      </FadeIn>

      <div ref={containerRef} className="max-w-6xl mx-auto">
        {featured.map((project, index) => {
          const targetScale = 1 - (totalCards - 1 - index) * 0.03
          const rangeStart = index * (1 / totalCards)
          return (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              progress={scrollYProgress}
              range={[rangeStart, 1]}
              targetScale={targetScale}
            />
          )
        })}
      </div>

      {/* More projects → full projects page */}
      <FadeIn className="flex justify-center mt-8 sm:mt-12">
        <a
          href="#/work"
          className="group inline-flex items-center gap-3 rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-10 py-4 sm:px-12 sm:py-5 text-sm sm:text-base transition-colors duration-200 hover:bg-[#D7E2EA]/10"
        >
          More Projects
          <ArrowUpRight
            size={20}
            className="opacity-60 group-hover:opacity-100 transition-opacity"
          />
        </a>
      </FadeIn>
    </section>
  )
}

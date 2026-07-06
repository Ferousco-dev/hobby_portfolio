import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react'
import FadeIn from './FadeIn'
import { useProjects } from '../hooks/useProjects'

export default function AllProjectsPage() {
  const { projects } = useProjects()

  return (
    <section className="relative min-h-screen bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-8 pb-24">
      {/* Top bar */}
      <div className="flex items-center justify-between max-w-6xl mx-auto mb-12 sm:mb-16">
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-[#D7E2EA]/70 font-medium uppercase tracking-widest text-sm transition-colors duration-200 hover:text-[#D7E2EA]"
        >
          <ArrowLeft size={18} />
          Back
        </a>
        <p className="text-[#D7E2EA] font-black uppercase tracking-widest text-sm">
          Oresajo Fiyinfoluwa
        </p>
      </div>

      {/* Heading */}
      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          y={40}
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-14 sm:mb-20"
          style={{ fontSize: 'clamp(2.75rem, 11vw, 150px)' }}
        >
          All Projects
        </FadeIn>
      </div>

      {/* Grid — one image per project, each links to its detail page */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {projects.map((project, i) => (
          <FadeIn key={project.slug} delay={i * 0.08}>
            <a
              href={`#/project/${project.slug}`}
              className="group flex flex-col h-full rounded-[32px] sm:rounded-[40px] border-2 border-[#D7E2EA]/20 bg-[#111] overflow-hidden transition-colors duration-200 hover:border-[#D7E2EA]/60"
            >
              <div className="overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
                <img
                  src={project.image}
                  alt={`${project.name} preview`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-col gap-4 p-6 sm:p-8 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#D7E2EA]/50 font-light uppercase tracking-widest text-xs sm:text-sm">
                      {project.category}
                    </span>
                    <h2 className="text-[#D7E2EA] font-medium uppercase text-xl sm:text-2xl leading-tight">
                      {project.name}
                    </h2>
                  </div>
                  <span className="text-[#D7E2EA]/25 font-black leading-none text-4xl sm:text-5xl">
                    {project.number}
                  </span>
                </div>

                <p className="text-[#D7E2EA]/60 font-light leading-relaxed text-sm sm:text-base line-clamp-4">
                  {project.writeup || project.summary}
                </p>

                <div className="flex flex-wrap gap-2 mt-1">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA]/70 px-3 py-1 text-xs font-light uppercase tracking-wider"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-auto pt-2">
                  <span className="inline-flex items-center gap-2 text-[#D7E2EA] font-medium uppercase tracking-widest text-sm transition-opacity duration-200 group-hover:opacity-70">
                    View project
                    <ArrowUpRight size={16} />
                  </span>
                  {project.fileUrl && (
                    <span className="inline-flex items-center gap-1.5 text-[#D7E2EA]/50 text-xs uppercase tracking-widest">
                      <Download size={14} />
                      File
                    </span>
                  )}
                </div>
              </div>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

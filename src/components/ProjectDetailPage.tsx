import { ArrowLeft, ArrowUpRight, Download } from 'lucide-react'
import FadeIn from './FadeIn'
import ContactButton from './ContactButton'
import { useProjects } from '../hooks/useProjects'

interface ProjectDetailPageProps {
  slug: string
}

export default function ProjectDetailPage({ slug }: ProjectDetailPageProps) {
  const { projects, loading } = useProjects()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <section className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-[#D7E2EA]/60 uppercase tracking-widest text-sm">
          {loading ? 'Loading project…' : 'Project not found'}
        </p>
        {!loading && (
          <a
            href="#/work"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 text-sm transition-colors duration-200 hover:bg-[#D7E2EA]/10"
          >
            <ArrowLeft size={16} />
            All projects
          </a>
        )}
      </section>
    )
  }

  return (
    <section className="relative min-h-screen bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-8 pb-24">
      {/* Top bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-10 sm:mb-14">
        <a
          href="#/work"
          className="inline-flex items-center gap-2 text-[#D7E2EA]/70 font-medium uppercase tracking-widest text-sm transition-colors duration-200 hover:text-[#D7E2EA]"
        >
          <ArrowLeft size={18} />
          All projects
        </a>
        <span className="text-[#D7E2EA]/25 font-black leading-none text-4xl sm:text-5xl">
          {project.number}
        </span>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-8 sm:gap-10">
        {/* Header */}
        <FadeIn className="flex flex-col gap-4">
          <span className="text-[#D7E2EA]/50 font-light uppercase tracking-[0.25em] text-sm">
            {project.category}
          </span>
          <h1
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 96px)' }}
          >
            {project.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-1">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-[#D7E2EA]/25 text-[#D7E2EA]/70 px-4 py-1.5 text-xs font-light uppercase tracking-wider"
              >
                {tool}
              </span>
            ))}
          </div>
        </FadeIn>

        {/* Hero image */}
        <FadeIn
          y={30}
          className="overflow-hidden rounded-[28px] sm:rounded-[40px] border-2 border-[#D7E2EA]/15"
        >
          <img
            src={project.image}
            alt={`${project.name}`}
            className="w-full object-cover"
            style={{ maxHeight: 560 }}
          />
        </FadeIn>

        {/* Summary */}
        <FadeIn className="max-w-3xl">
          <p
            className="text-[#D7E2EA]/80 font-light leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          >
            {project.summary}
          </p>
        </FadeIn>

        {/* Gemini-generated write-up (saved in the DB) */}
        {project.writeup && (
          <FadeIn className="max-w-3xl flex flex-col gap-4 border-t border-[#D7E2EA]/10 pt-8">
            <h2 className="text-[#D7E2EA]/50 font-light uppercase tracking-[0.25em] text-sm">
              About this project
            </h2>
            {project.writeup.split(/\n{2,}/).map((para, i) => (
              <p
                key={i}
                className="text-[#D7E2EA]/70 font-light leading-relaxed"
                style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.15rem)' }}
              >
                {para.trim()}
              </p>
            ))}
          </FadeIn>
        )}

        {/* Download, external link + CTA */}
        <FadeIn className="flex flex-wrap items-center gap-4 pt-2">
          {project.fileUrl && (
            <a
              href={project.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-2 rounded-full font-medium uppercase tracking-widest text-[#0C0C0C] bg-[#D7E2EA] px-8 py-3.5 text-sm transition-opacity duration-200 hover:opacity-80"
            >
              <Download size={18} />
              Download project
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3.5 text-sm transition-colors duration-200 hover:bg-[#D7E2EA]/10"
            >
              View live / source
              <ArrowUpRight size={18} />
            </a>
          )}
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { PROJECTS, type Project } from '../data/projects'

// Shape of a row in the Supabase `projects` table.
interface ProjectRow {
  slug: string
  number: string | null
  category: string | null
  name: string
  summary: string | null
  image_url: string | null
  tools: string[] | null
  link: string | null
  featured: boolean | null
  sort_order: number | null
  file_url: string | null
  writeup: string | null
}

function mapRow(row: ProjectRow, index: number): Project {
  return {
    slug: row.slug,
    number: row.number ?? String(index + 1).padStart(2, '0'),
    category: row.category ?? 'Project',
    name: row.name,
    summary: row.summary ?? '',
    image: row.image_url ?? '',
    tools: row.tools ?? [],
    link: row.link ?? undefined,
    featured: row.featured ?? false,
    fileUrl: row.file_url ?? undefined,
    writeup: row.writeup ?? undefined,
  }
}

// Module-level cache so navigating between routes doesn't refetch or flash.
let cache: Project[] | null = null

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(cache ?? PROJECTS)
  const [loading, setLoading] = useState<boolean>(!cache && Boolean(supabase))

  useEffect(() => {
    if (cache || !supabase) return
    let active = true

    supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data && data.length) {
          const mapped = (data as ProjectRow[]).map(mapRow)
          cache = mapped
          setProjects(mapped)
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { projects, loading }
}

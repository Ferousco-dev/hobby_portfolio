import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Public (read-only) Supabase access for the site. These are injected at
// build time from environment variables — see .env.example.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

// When env vars are missing the client is null and the site falls back to the
// static project list in src/data/projects.ts — so it always renders.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null

import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Project } from '@/lib/types'
import { PageRenderer } from '@/components/renderer/PageRenderer'

/* ISR: revalida a cada 60s após o primeiro acesso */
export const revalidate = 60
export const dynamicParams = true

/* ── Cliente público (sem auth) ─────────────────────────── */
function publicSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/* ── generateMetadata ───────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = publicSupabase()

  const { data } = await supabase
    .from('projects')
    .select('name')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!data) return { title: 'Página não encontrada' }

  return {
    title: data.name,
    openGraph: { title: data.name },
  }
}

/* ── Page ───────────────────────────────────────────────── */
export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = publicSupabase()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!project) notFound()

  const typedProject = project as Project
  const sections = typedProject.content?.sections ?? []

  if (sections.length === 0) notFound()

  return <PageRenderer sections={sections} />
}

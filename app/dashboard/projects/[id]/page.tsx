import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Project } from '@/lib/types'
import { TemplatePicker } from '@/components/dashboard/TemplatePicker'
import { PageRenderer } from '@/components/renderer/PageRenderer'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return { title: `Editor — PonForge`, description: `Editando projeto ${id}` }
}

export default async function ProjectEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!project) redirect('/dashboard/projects')

  const hasContent = (project as Project).content?.sections?.length > 0

  if (!hasContent) {
    return <TemplatePicker project={project as Project} />
  }

  return (
    <PageRenderer sections={(project as Project).content.sections} />
  )
}

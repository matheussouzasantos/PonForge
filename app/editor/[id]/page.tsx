import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Project } from '@/lib/types'
import { TemplatePicker } from '@/components/dashboard/TemplatePicker'
import { EditorProvider } from '@/components/editor/EditorProvider'
import { EditorSidebar } from '@/components/editor/EditorSidebar'
import { EditorCanvas } from '@/components/editor/EditorCanvas'
import { SectionEditPanel } from '@/components/editor/SectionEditPanel'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return { title: `Editor — PonForge`, description: `Editando projeto ${id}` }
}

export default async function EditorPage({
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

  const typedProject = project as Project
  const hasContent = typedProject.content?.sections?.length > 0

  if (!hasContent) {
    return <TemplatePicker project={typedProject} />
  }

  return (
    <EditorProvider projectId={id} initialSections={typedProject.content.sections}>
      <EditorSidebar projectName={typedProject.name} projectId={id} slug={typedProject.slug} />
      <SectionEditPanel />
      <main className="flex-1 overflow-y-auto" style={{ background: '#0B0B0C' }}>
        <EditorCanvas />
      </main>
    </EditorProvider>
  )
}


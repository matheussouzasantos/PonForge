'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutTemplate } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { type Template } from '@/lib/templates'
import { TemplateGallery } from './TemplateGallery'
import {
  CreateProjectDrawer,
  type CreateProjectPayload,
} from './CreateProjectDrawer'
import './template-picker.css'

type Props = { userId: string }

export function TemplatesPageContent({ userId }: Props) {
  const router = useRouter()
  const [applying, setApplying] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  function handleUse(template: Template) {
    setSelectedTemplate(template)
  }

  async function handleCreateProject(data: CreateProjectPayload) {
    if (!selectedTemplate) return

    // Marca o card como "em progresso" antes do insert
    setApplying(selectedTemplate.id)

    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          name: data.name,
          slug: data.slug,
          user_id: userId,
          status: 'draft',
          content: selectedTemplate.content, // JSON do template clonado
        })
        .select('id')
        .single()

      if (error) throw new Error(error.message)

      router.push(`/dashboard/projects/${project.id}`)
    } catch (err) {
      setApplying(null)
      throw err // deixa o drawer exibir o erro
    }
  }

  return (
    <div className="pf-tpl-page">
      <div className="pf-tpl-header">
        <div className="pf-tpl-header__info">
          <div className="pf-tpl-header__project">
            <LayoutTemplate size={14} />
            Galeria
          </div>
          <h1>Templates</h1>
          <p>
            Escolha um template pronto para começar sua landing page.
            Um novo projeto será criado automaticamente.
          </p>
        </div>
      </div>

      <TemplateGallery
        applying={applying}
        ctaLabel="Usar este template"
        onUse={handleUse}
      />

      <CreateProjectDrawer
        open={!!selectedTemplate}
        onClose={() => {
          setSelectedTemplate(null)
          setApplying(null)
        }}
        onCreateProject={handleCreateProject}
        title={selectedTemplate ? `Usar "${selectedTemplate.name}"` : 'Criar projeto'}
        subtitle="Escolha um nome e slug para o seu projeto"
      />
    </div>
  )
}

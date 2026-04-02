'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Layers } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { type Template } from '@/lib/templates'
import { TemplateGallery } from './TemplateGallery'
import type { Project } from '@/lib/types'
import './template-picker.css'

export function TemplatePicker({ project }: { project: Project }) {
  const router = useRouter()
  const [applying, setApplying] = useState<string | null>(null)

  async function handleUse(template: Template) {
    setApplying(template.id)
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          content: template.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id)

      if (error) throw error
      router.refresh()
    } catch {
      setApplying(null)
    }
  }

  return (
    <div className="pf-tpl-page">
      <div className="pf-tpl-header">
        <button
          className="pf-tpl-back"
          onClick={() => router.push('/dashboard/projects')}
        >
          <ArrowLeft size={15} />
          Meus projetos
        </button>

        <div className="pf-tpl-header__info">
          <div className="pf-tpl-header__project">
            <Layers size={14} />
            {project.name}
          </div>
          <h1>Escolha um template</h1>
          <p>
            Selecione o ponto de partida da sua landing page. Você poderá
            editar todos os textos, cores e seções depois.
          </p>
        </div>
      </div>

      <TemplateGallery applying={applying} onUse={handleUse} />
    </div>
  )
}

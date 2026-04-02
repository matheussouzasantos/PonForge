'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Globe, Loader2 } from 'lucide-react'
import { useEditorStore } from '@/lib/stores/editorStore'
import { useSave } from '@/lib/hooks/useSave'
import { SectionList } from './SectionList'
import { UnsavedChangesModal } from './UnsavedChangesModal'
import { PublishSuccessModal } from './PublishSuccessModal'
import { SaveToast } from './SaveToast'

interface EditorSidebarProps {
  projectName: string
  projectId: string
  slug: string
}

export function EditorSidebar({ projectName, projectId, slug }: EditorSidebarProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  const sections        = useEditorStore((s) => s.sections)
  const addSection      = useEditorStore((s) => s.addSection)
  const removeSection   = useEditorStore((s) => s.removeSection)
  const reorderSections = useEditorStore((s) => s.reorderSections)
  const activeSectionId = useEditorStore((s) => s.activeSectionId)
  const setActive       = useEditorStore((s) => s.setActiveSectionId)
  const isDirty         = useEditorStore((s) => s.isDirty)
  const saveStatus      = useEditorStore((s) => s.saveStatus)

  const { save, publish } = useSave(projectId)
  const isSaving = saveStatus === 'saving'

  /* ── Aviso nativo ao fechar / recarregar a aba ──── */
  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (!isDirty) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  function handleBack() {
    if (isDirty) {
      setShowModal(true)
    } else {
      router.push('/dashboard/projects')
    }
  }

  async function handleSaveAndLeave() {
    const ok = await save()
    if (ok) router.push('/dashboard/projects')
  }

  return (
    <>
      <aside
        style={{
          width: 280,
          height: '100vh',
          background: '#1A1A1D',
          borderRight: '1px solid #121214',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        {/* ── Header ──────────────────────────────── */}
        <div
          style={{
            height: 56,
            borderBottom: '1px solid #121214',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 16px',
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleBack}
            title="Voltar para projetos"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: 'none',
              background: 'transparent',
              color: '#71717A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = '#F5E6D3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#71717A'
            }}
          >
            <ArrowLeft size={14} strokeWidth={2} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F5E6D3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {projectName}
            </span>
            <span style={{ fontSize: 11, color: isDirty ? '#A16207' : '#3F3F46', marginTop: 1 }}>
              {isDirty ? '● Não salvo' : 'Editor'}
            </span>
          </div>
        </div>

        {/* ── Lista de seções ──────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#3F3F46', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px 8px', margin: 0 }}>
            Seções
            <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 4 }}>
              ({sections.length})
            </span>
          </p>
          <SectionList
            sections={sections}
            onAddSection={addSection}
            onRemove={removeSection}
            onReorder={reorderSections}
            activeSectionId={activeSectionId}
            onSelectSection={setActive}
          />
        </div>

        {/* ── Footer: Salvar + Publicar ─────────── */}
        <div
          style={{
            flexShrink: 0,
            padding: '12px 12px 14px',
            borderTop: '1px solid #121214',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {/* Salvar */}
          <button
            onClick={save}
            disabled={isSaving}
            style={{
              width: '100%',
              height: 38,
              borderRadius: 10,
              border: '1px solid #2A2A2D',
              background: 'rgba(255,255,255,0.04)',
              color: isSaving ? '#52525B' : '#D4D4D8',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s, border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (isSaving) return
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.borderColor = '#3F3F46'
              e.currentTarget.style.color = '#F5E6D3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = '#2A2A2D'
              e.currentTarget.style.color = '#D4D4D8'
            }}
          >
            {isSaving
              ? <><Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />Salvando…</>
              : <><Save size={13} />Salvar alterações</>
            }
          </button>

          {/* Publicar */}
          <button
            onClick={async () => {
              const ok = await publish()
              if (ok) setShowPublishModal(true)
            }}
            disabled={isSaving}
            style={{
              width: '100%',
              height: 38,
              borderRadius: 10,
              border: '1px solid #FF6A2B',
              background: 'linear-gradient(135deg, #FF6A2B 0%, #ff4f00 100%)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.6 : 1,
              boxShadow: isSaving ? 'none' : '0 2px 12px rgba(255,106,43,0.35)',
              transition: 'opacity 0.15s, box-shadow 0.15s, filter 0.15s',
            }}
            onMouseEnter={(e) => {
              if (isSaving) return
              e.currentTarget.style.filter = 'brightness(1.1)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,106,43,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = ''
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(255,106,43,0.35)'
            }}
          >
            <Globe size={13} />
            Publicar projeto
          </button>
        </div>
      </aside>

      {/* Modal de saída sem salvar */}
      {showModal && (
        <UnsavedChangesModal
          isSaving={isSaving}
          onLeave={() => router.push('/dashboard/projects')}
          onSaveAndLeave={handleSaveAndLeave}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Modal de publicação */}
      {showPublishModal && (
        <PublishSuccessModal
          slug={slug}
          onClose={() => setShowPublishModal(false)}
        />
      )}

      {/* Toast de confirmação de save */}
      <SaveToast />
    </>
  )
}

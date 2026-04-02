'use client'

import { useState, useRef } from 'react'
import { Plus, GripVertical, Trash2, X, AlertTriangle } from 'lucide-react'
import type { Section, SectionType } from '@/lib/types'
import {
  Menu,
  Sparkles,
  Building2,
  LayoutGrid,
  CheckCircle2,
  ListOrdered,
  MessageSquare,
  Tag,
  HelpCircle,
  MousePointerClick,
  PanelBottom,
} from 'lucide-react'
import { AddSectionModal } from './AddSectionModal'

const SECTION_META: Record<SectionType, { label: string; Icon: React.ElementType }> = {
  navbar:       { label: 'Navegação',     Icon: Menu              },
  hero:         { label: 'Hero',          Icon: Sparkles          },
  logos:        { label: 'Logos',         Icon: Building2         },
  features:     { label: 'Features',      Icon: LayoutGrid        },
  benefits:     { label: 'Benefícios',    Icon: CheckCircle2      },
  steps:        { label: 'Passo a passo', Icon: ListOrdered       },
  testimonials: { label: 'Depoimentos',   Icon: MessageSquare     },
  pricing:      { label: 'Preços',        Icon: Tag               },
  faq:          { label: 'FAQ',           Icon: HelpCircle        },
  cta:          { label: 'CTA',           Icon: MousePointerClick },
  footer:       { label: 'Rodapé',        Icon: PanelBottom       },
}

function sectionSubtitle(section: Section): string | null {
  switch (section.type) {
    case 'hero':         return section.props.headline || null
    case 'features':     return section.props.title    || null
    case 'benefits':     return section.props.title    || null
    case 'steps':        return section.props.title    || null
    case 'testimonials': return section.props.title    || null
    case 'pricing':      return section.props.title    || null
    case 'faq':          return section.props.title    || null
    case 'cta':          return section.props.headline || null
    case 'navbar':       return section.props.logo     || null
    default:             return null
  }
}

type DropPosition = 'above' | 'below'
type DropTarget = { id: string; position: DropPosition } | null

function reorder(items: Section[], fromId: string, toId: string, position: DropPosition): Section[] {
  if (fromId === toId) return items
  const from = items.find((s) => s.id === fromId)!
  const without = items.filter((s) => s.id !== fromId)
  const toIndex = without.findIndex((s) => s.id === toId)
  const insertAt = position === 'above' ? toIndex : toIndex + 1
  const result = [...without]
  result.splice(insertAt, 0, from)
  return result
}

export function SectionList({
  sections,
  onAddSection,
  onReorder,
  onRemove,
  activeSectionId,
  onSelectSection,
}: {
  sections: Section[]
  onAddSection?: (type: SectionType) => void
  onReorder?: (sections: Section[]) => void
  onRemove?: (id: string) => void
  activeSectionId?: string | null
  onSelectSection?: (id: string) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})

  function handleDragStart(e: React.DragEvent, id: string) {
    if (confirmingId) return
    setDraggingId(id)
    e.dataTransfer.effectAllowed = 'move'
    const ghost = document.createElement('div')
    ghost.style.position = 'absolute'
    ghost.style.top = '-9999px'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const el = itemRefs.current[id]
    if (!el) return
    const { top, height } = el.getBoundingClientRect()
    const position: DropPosition = e.clientY < top + height / 2 ? 'above' : 'below'
    setDropTarget((prev) =>
      prev?.id === id && prev?.position === position ? prev : { id, position }
    )
  }

  function handleDrop(e: React.DragEvent, toId: string) {
    e.preventDefault()
    if (!draggingId || !dropTarget) return
    const next = reorder(sections, draggingId, toId, dropTarget.position)
    onReorder?.(next)
    setDraggingId(null)
    setDropTarget(null)
  }

  function handleDragEnd() {
    setDraggingId(null)
    setDropTarget(null)
  }

  const addButton = (
    <button
      className="w-full flex items-center justify-center gap-2 rounded-lg text-xs font-medium"
      style={{
        height: 34,
        marginTop: sections.length > 0 ? 8 : 0,
        background: 'rgba(255,106,43,0.06)',
        border: '1px dashed rgba(255,106,43,0.3)',
        color: '#FF6A2B',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,106,43,0.12)'
        e.currentTarget.style.borderColor = 'rgba(255,106,43,0.6)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,106,43,0.06)'
        e.currentTarget.style.borderColor = 'rgba(255,106,43,0.3)'
      }}
      onClick={() => setModalOpen(true)}
    >
      <Plus size={13} strokeWidth={2.5} />
      Adicionar seção
    </button>
  )

  if (sections.length === 0) {
    return (
      <>
        <div
          className="rounded-lg flex items-center justify-center mb-2"
          style={{ height: 60, background: 'rgba(255,255,255,0.02)', border: '1px dashed #2A2A2D' }}
        >
          <span className="text-xs" style={{ color: '#52525B' }}>Nenhuma seção</span>
        </div>
        {addButton}
        {modalOpen && (
          <AddSectionModal
            onAdd={(type) => onAddSection?.(type)}
            onClose={() => setModalOpen(false)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <ul
        className="flex flex-col"
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropTarget(null)
        }}
      >
        {sections.map((section, i) => {
          const meta = SECTION_META[section.type]
          const subtitle = sectionSubtitle(section)
          const isDragging = draggingId === section.id
          const isConfirming = confirmingId === section.id
          const isActive = activeSectionId === section.id
          const isAbove = dropTarget?.id === section.id && dropTarget.position === 'above'
          const isBelow = dropTarget?.id === section.id && dropTarget.position === 'below'

          return (
            <li
              key={section.id}
              ref={(el) => { itemRefs.current[section.id] = el }}
              draggable={!isConfirming}
              onDragStart={(e) => handleDragStart(e, section.id)}
              onDragOver={(e) => handleDragOver(e, section.id)}
              onDrop={(e) => handleDrop(e, section.id)}
              onDragEnd={handleDragEnd}
              style={{ position: 'relative' }}
            >
              {/* Indicador acima */}
              {isAbove && (
                <div style={{
                  position: 'absolute', top: 0, left: 8, right: 8,
                  height: 2, borderRadius: 2, background: '#FF6A2B',
                  zIndex: 10, transform: 'translateY(-1px)',
                }} />
              )}

              {isConfirming ? (
                <div
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <AlertTriangle size={13} strokeWidth={2} style={{ color: '#EF4444', flexShrink: 0 }} />
                  <span className="text-xs flex-1 truncate" style={{ color: '#FCA5A5' }}>
                    Remover {meta.label}?
                  </span>
                  <button
                    className="flex items-center justify-center rounded-md text-xs px-2"
                    style={{ height: 22, color: '#71717A', background: 'rgba(255,255,255,0.06)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#F5E6D3'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#71717A'}
                    onClick={() => setConfirmingId(null)}
                  >
                    <X size={11} strokeWidth={2.5} />
                  </button>
                  <button
                    className="flex items-center justify-center gap-1 rounded-md text-xs px-2"
                    style={{ height: 22, color: '#FCA5A5', background: 'rgba(239,68,68,0.15)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                    onClick={() => {
                      onRemove?.(section.id)
                      setConfirmingId(null)
                    }}
                  >
                    <Trash2 size={11} strokeWidth={2} />
                    Remover
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg select-none group"
                  style={{
                    background: isActive
                      ? 'rgba(255,106,43,0.08)'
                      : isDragging
                        ? 'rgba(255,255,255,0.06)'
                        : 'transparent',
                    opacity: isDragging ? 0.4 : 1,
                    borderLeft: isActive ? '2px solid #FF6A2B' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => onSelectSection?.(section.id)}
                  onMouseEnter={(e) => {
                    if (!isDragging && !isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isDragging && !isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <span
                    className="shrink-0 flex items-center justify-center"
                    style={{ width: 16, height: 16, color: '#3F3F46', cursor: 'grab' }}
                    onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
                    onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
                  >
                    <GripVertical size={12} strokeWidth={2} />
                  </span>

                  <span className="text-xs tabular-nums shrink-0 w-4 text-right" style={{ color: '#3F3F46' }}>
                    {i + 1}
                  </span>

                  <span
                    className="shrink-0 flex items-center justify-center rounded-md"
                    style={{ width: 26, height: 26, background: 'rgba(255,255,255,0.04)', color: '#71717A' }}
                  >
                    <meta.Icon size={13} strokeWidth={1.75} />
                  </span>

                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium leading-none truncate" style={{ color: '#D4D4D8' }}>
                      {meta.label}
                    </span>
                    {subtitle && (
                      <span className="text-xs leading-none truncate mt-0.5" style={{ color: '#52525B' }}>
                        {subtitle}
                      </span>
                    )}
                  </span>

                  <button
                    className="shrink-0 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ width: 22, height: 22, color: '#52525B' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#EF4444'
                      e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#52525B'
                      e.currentTarget.style.background = 'transparent'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setConfirmingId(section.id)
                    }}
                  >
                    <Trash2 size={12} strokeWidth={2} />
                  </button>
                </div>
              )}

              {/* Indicador abaixo */}
              {isBelow && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 8, right: 8,
                  height: 2, borderRadius: 2, background: '#FF6A2B',
                  zIndex: 10, transform: 'translateY(1px)',
                }} />
              )}
            </li>
          )
        })}
      </ul>

      {addButton}

      {modalOpen && (
        <AddSectionModal
          onAdd={(type) => {
            onAddSection?.(type)
            setModalOpen(false)
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}

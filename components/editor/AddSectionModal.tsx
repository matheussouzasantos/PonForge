'use client'

import { useEffect } from 'react'
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
  X,
} from 'lucide-react'
import type { SectionType } from '@/lib/types'

const SECTION_OPTIONS: { type: SectionType; label: string; description: string; Icon: React.ElementType }[] = [
  { type: 'navbar',       label: 'Navegação',     description: 'Menu de topo com links e CTA',          Icon: Menu              },
  { type: 'hero',         label: 'Hero',           description: 'Título principal e chamada para ação',  Icon: Sparkles          },
  { type: 'logos',        label: 'Logos',          description: 'Faixa de clientes ou parceiros',        Icon: Building2         },
  { type: 'features',     label: 'Features',       description: 'Grade de funcionalidades ou recursos',  Icon: LayoutGrid        },
  { type: 'benefits',     label: 'Benefícios',     description: 'Diferenciais com imagem e lista',       Icon: CheckCircle2      },
  { type: 'steps',        label: 'Passo a passo',  description: 'Como funciona em etapas numeradas',     Icon: ListOrdered       },
  { type: 'testimonials', label: 'Depoimentos',    description: 'Avaliações e citações de clientes',     Icon: MessageSquare     },
  { type: 'pricing',      label: 'Preços',         description: 'Tabela de planos e valores',            Icon: Tag               },
  { type: 'faq',          label: 'FAQ',            description: 'Perguntas e respostas frequentes',      Icon: HelpCircle        },
  { type: 'cta',          label: 'CTA',            description: 'Bloco de conversão com botões',         Icon: MousePointerClick },
  { type: 'footer',       label: 'Rodapé',         description: 'Links, copyright e informações finais', Icon: PanelBottom       },
]

interface AddSectionModalProps {
  onAdd: (type: SectionType) => void
  onClose: () => void
}

export function AddSectionModal({ onAdd, onClose }: AddSectionModalProps) {
  // Fechar com Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-xl flex flex-col"
        style={{
          maxWidth: 520,
          maxHeight: '80vh',
          background: '#1A1A1D',
          border: '1px solid #2A2A2D',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 shrink-0"
          style={{ height: 52, borderBottom: '1px solid #2A2A2D' }}
        >
          <span className="text-sm font-semibold" style={{ color: '#F5E6D3' }}>
            Adicionar seção
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg transition-colors"
            style={{ width: 28, height: 28, color: '#71717A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = '#F5E6D3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#71717A'
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto p-3">
          <div className="grid grid-cols-2 gap-1.5">
            {SECTION_OPTIONS.map(({ type, label, description, Icon }) => (
              <button
                key={type}
                className="flex items-start gap-3 p-3 rounded-lg text-left transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid transparent' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = '#FF6A2B'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
                onClick={() => {
                  onAdd(type)
                  onClose()
                }}
              >
                <span
                  className="shrink-0 flex items-center justify-center rounded-lg mt-0.5"
                  style={{ width: 30, height: 30, background: 'rgba(255,106,43,0.1)', color: '#FF6A2B' }}
                >
                  <Icon size={14} strokeWidth={1.75} />
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="text-xs font-medium" style={{ color: '#D4D4D8' }}>
                    {label}
                  </span>
                  <span className="text-xs mt-0.5 leading-snug" style={{ color: '#52525B' }}>
                    {description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { X } from 'lucide-react'
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
import type { Section, SectionType } from '@/lib/types'
import { useEditorStore } from '@/lib/stores/editorStore'
import { ColorField } from './ColorField'
import { ImageUpload } from './ImageUpload'
import './section-edit-panel.css'

/* ═══════════════════════════════════════════════════════
   Metadata por tipo
   ═══════════════════════════════════════════════════════ */
const SECTION_META: Record<SectionType, { label: string; description: string; Icon: React.ElementType }> = {
  navbar:       { label: 'Navegação',     description: 'Menu de topo com links e CTA',          Icon: Menu              },
  hero:         { label: 'Hero',          description: 'Título principal e chamada para ação',  Icon: Sparkles          },
  logos:        { label: 'Logos',         description: 'Faixa de clientes ou parceiros',        Icon: Building2         },
  features:     { label: 'Features',      description: 'Grade de funcionalidades ou recursos',  Icon: LayoutGrid        },
  benefits:     { label: 'Benefícios',    description: 'Diferenciais com imagem e lista',       Icon: CheckCircle2      },
  steps:        { label: 'Passo a passo', description: 'Como funciona em etapas numeradas',     Icon: ListOrdered       },
  testimonials: { label: 'Depoimentos',   description: 'Avaliações e citações de clientes',     Icon: MessageSquare     },
  pricing:      { label: 'Preços',        description: 'Tabela de planos e valores',            Icon: Tag               },
  faq:          { label: 'FAQ',           description: 'Perguntas e respostas frequentes',      Icon: HelpCircle        },
  cta:          { label: 'CTA',           description: 'Bloco de conversão com botões',         Icon: MousePointerClick },
  footer:       { label: 'Rodapé',        description: 'Links, copyright e informações finais', Icon: PanelBottom       },
}

/* ═══════════════════════════════════════════════════════
   Bloco de cores por seção (compartilhado)
   ═══════════════════════════════════════════════════════ */
function StyleBlock({
  sectionId,
  style,
  update,
}: {
  sectionId: string
  style: { bgColor?: string; textColor?: string } | undefined
  update: (props: Record<string, unknown>) => void
}) {
  function handleStyle(field: string, value: string) {
    update({ style: { ...style, [field]: value || undefined } })
  }

  return (
    <>
      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Cores</p>
      <ColorField
        label="Cor de fundo"
        value={style?.bgColor}
        onChange={(v) => handleStyle('bgColor', v)}
        hint="Deixe vazio para usar o padrão do tema"
      />
      <ColorField
        label="Cor do texto"
        value={style?.textColor}
        onChange={(v) => handleStyle('textColor', v)}
      />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   NavbarEditPanel
   ═══════════════════════════════════════════════════════ */
function NavbarEditPanel({ section }: { section: Extract<Section, { type: 'navbar' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const { logo, links, ctaText, ctaUrl, style } = section.props

  function setField(field: string, value: string) {
    update(section.id, { [field]: value })
  }

  function setLink(i: number, field: 'label' | 'href', value: string) {
    const next = links.map((l, idx) => idx === i ? { ...l, [field]: value } : l)
    update(section.id, { links: next })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Logo / Nome</label>
        <input
          className="pf-edit-input"
          value={logo}
          onChange={(e) => setField('logo', e.target.value)}
          placeholder="Nome da marca"
        />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Links de navegação</p>
      <div className="pf-edit-items">
        {links.map((link, i) => (
          <div key={i} className="pf-edit-item pf-edit-item--col">
            <input
              className="pf-edit-input"
              value={link.label}
              onChange={(e) => setLink(i, 'label', e.target.value)}
              placeholder="Label"
            />
            <input
              className="pf-edit-input"
              value={link.href}
              onChange={(e) => setLink(i, 'href', e.target.value)}
              placeholder="https://..."
            />
          </div>
        ))}
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">CTA do menu</p>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Texto do botão</label>
        <input
          className="pf-edit-input"
          value={ctaText || ''}
          onChange={(e) => setField('ctaText', e.target.value)}
          placeholder="Texto do CTA"
        />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">URL do botão</label>
        <input
          className="pf-edit-input"
          value={ctaUrl || ''}
          onChange={(e) => setField('ctaUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   HeroEditPanel
   ═══════════════════════════════════════════════════════ */
function HeroEditPanel({ section }: { section: Extract<Section, { type: 'hero' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const { variant, headline, subheadline, primaryCtaText, primaryCtaUrl, secondaryCtaText, secondaryCtaUrl, imageUrl, style } = section.props
  const projectId = useEditorStore((s) => s.projectId)

  function setField(field: string, value: string) {
    update(section.id, { [field]: value })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Variante</label>
        <select
          className="pf-edit-select"
          value={variant}
          onChange={(e) => setField('variant', e.target.value)}
        >
          <option value="centered">Centralizado</option>
          <option value="split-left">Imagem à direita</option>
          <option value="split-right">Imagem à esquerda</option>
        </select>
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Título principal</label>
        <input
          className="pf-edit-input"
          value={headline}
          onChange={(e) => setField('headline', e.target.value)}
          placeholder="Título do hero"
        />
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Subtítulo</label>
        <textarea
          className="pf-edit-textarea"
          value={subheadline}
          onChange={(e) => setField('subheadline', e.target.value)}
          placeholder="Descrição breve"
        />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Botão primário</p>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Texto</label>
        <input
          className="pf-edit-input"
          value={primaryCtaText}
          onChange={(e) => setField('primaryCtaText', e.target.value)}
        />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">URL</label>
        <input
          className="pf-edit-input"
          value={primaryCtaUrl}
          onChange={(e) => setField('primaryCtaUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Botão secundário</p>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Texto</label>
        <input
          className="pf-edit-input"
          value={secondaryCtaText || ''}
          onChange={(e) => setField('secondaryCtaText', e.target.value)}
          placeholder="Opcional"
        />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">URL</label>
        <input
          className="pf-edit-input"
          value={secondaryCtaUrl || ''}
          onChange={(e) => setField('secondaryCtaUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Imagem</p>
      <ImageUpload
        label="Imagem do hero"
        value={imageUrl}
        onChange={(url) => setField('imageUrl', url)}
        projectId={projectId}
        fieldKey={`${section.id}-hero`}
        hint="Usada nas variantes split"
      />

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   LogosEditPanel
   ═══════════════════════════════════════════════════════ */
function LogosEditPanel({ section }: { section: Extract<Section, { type: 'logos' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const projectId = useEditorStore((s) => s.projectId)
  const { title, items, style } = section.props

  function setItemImage(i: number, url: string) {
    const next = items.map((item, idx) => idx === i ? { ...item, imageUrl: url } : item)
    update(section.id, { items: next })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Título</label>
        <input
          className="pf-edit-input"
          value={title || ''}
          onChange={(e) => update(section.id, { title: e.target.value })}
          placeholder="Ex: Empresas que confiam"
        />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Logos ({items.length})</p>
      {items.length > 0 ? (
        <div className="pf-edit-items">
          {items.map((item, i) => (
            <div key={i} className="pf-edit-item pf-edit-item--col">
              <input
                className="pf-edit-input"
                value={item.name}
                onChange={(e) => {
                  const next = items.map((it, idx) => idx === i ? { ...it, name: e.target.value } : it)
                  update(section.id, { items: next })
                }}
                placeholder="Nome da empresa"
              />
              <ImageUpload
                label="Logo"
                value={item.imageUrl}
                onChange={(url) => setItemImage(i, url)}
                projectId={projectId}
                fieldKey={`${section.id}-logo-${i}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="pf-edit-empty">
          <div className="pf-edit-empty__icon"><Building2 size={16} /></div>
          <span className="pf-edit-empty__text">Nenhum logo adicionado</span>
        </div>
      )}

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   FeaturesEditPanel
   ═══════════════════════════════════════════════════════ */
function FeaturesEditPanel({ section }: { section: Extract<Section, { type: 'features' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const { variant, label, title, subtitle, items, style } = section.props

  function setField(field: string, value: string) {
    update(section.id, { [field]: value })
  }

  function setItem(i: number, field: string, value: string) {
    const next = items.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    update(section.id, { items: next })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Variante</label>
        <select
          className="pf-edit-select"
          value={variant}
          onChange={(e) => setField('variant', e.target.value)}
        >
          <option value="grid-3">Grade 3 colunas</option>
          <option value="grid-2">Grade 2 colunas</option>
          <option value="list">Lista</option>
        </select>
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Label</label>
        <input
          className="pf-edit-input"
          value={label || ''}
          onChange={(e) => setField('label', e.target.value)}
          placeholder="Ex: Funcionalidades"
        />
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Título da seção</label>
        <input
          className="pf-edit-input"
          value={title}
          onChange={(e) => setField('title', e.target.value)}
        />
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Subtítulo</label>
        <textarea
          className="pf-edit-textarea"
          value={subtitle || ''}
          onChange={(e) => setField('subtitle', e.target.value)}
          placeholder="Descrição breve"
        />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Features ({items.length})</p>
      <div className="pf-edit-items">
        {items.map((item, i) => (
          <div key={i} className="pf-edit-item pf-edit-item--col">
            <div className="pf-edit-item-row">
              <input
                className="pf-edit-input pf-edit-input--icon"
                value={item.icon}
                onChange={(e) => setItem(i, 'icon', e.target.value)}
                placeholder="🔥"
                maxLength={4}
              />
              <input
                className="pf-edit-input"
                value={item.title}
                onChange={(e) => setItem(i, 'title', e.target.value)}
                placeholder="Título"
              />
            </div>
            <textarea
              className="pf-edit-textarea pf-edit-textarea--sm"
              value={item.description}
              onChange={(e) => setItem(i, 'description', e.target.value)}
              placeholder="Descrição do recurso"
            />
          </div>
        ))}
      </div>

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   BenefitsEditPanel
   ═══════════════════════════════════════════════════════ */
function BenefitsEditPanel({ section }: { section: Extract<Section, { type: 'benefits' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const projectId = useEditorStore((s) => s.projectId)
  const { variant, label, title, subtitle, items, imageUrl, ctaText, ctaUrl, style } = section.props

  function setField(field: string, value: string) {
    update(section.id, { [field]: value })
  }

  function setItem(i: number, field: string, value: string) {
    const next = items.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    update(section.id, { items: next })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Variante</label>
        <select
          className="pf-edit-select"
          value={variant}
          onChange={(e) => setField('variant', e.target.value)}
        >
          <option value="image-left">Imagem à esquerda</option>
          <option value="image-right">Imagem à direita</option>
          <option value="centered">Centralizado</option>
        </select>
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Label</label>
        <input className="pf-edit-input" value={label || ''} onChange={(e) => setField('label', e.target.value)} />
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Título</label>
        <input className="pf-edit-input" value={title} onChange={(e) => setField('title', e.target.value)} />
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Subtítulo</label>
        <textarea className="pf-edit-textarea" value={subtitle || ''} onChange={(e) => setField('subtitle', e.target.value)} />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Benefícios ({items.length})</p>
      <div className="pf-edit-items">
        {items.map((item, i) => (
          <div key={i} className="pf-edit-item pf-edit-item--col">
            <input
              className="pf-edit-input"
              value={item.title}
              onChange={(e) => setItem(i, 'title', e.target.value)}
              placeholder="Título"
            />
            <textarea
              className="pf-edit-textarea pf-edit-textarea--sm"
              value={item.description}
              onChange={(e) => setItem(i, 'description', e.target.value)}
              placeholder="Descrição"
            />
          </div>
        ))}
      </div>

      <div className="pf-edit-divider" />
      <ImageUpload
        label="Imagem"
        value={imageUrl}
        onChange={(url) => setField('imageUrl', url)}
        projectId={projectId}
        fieldKey={`${section.id}-benefits`}
      />

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Texto do CTA</label>
        <input className="pf-edit-input" value={ctaText || ''} onChange={(e) => setField('ctaText', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">URL do CTA</label>
        <input className="pf-edit-input" value={ctaUrl || ''} onChange={(e) => setField('ctaUrl', e.target.value)} placeholder="https://..." />
      </div>

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   StepsEditPanel
   ═══════════════════════════════════════════════════════ */
function StepsEditPanel({ section }: { section: Extract<Section, { type: 'steps' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const { label, title, subtitle, steps, style } = section.props

  function setField(field: string, value: string) {
    update(section.id, { [field]: value })
  }

  function setStep(i: number, field: string, value: string) {
    const next = steps.map((step, idx) => idx === i ? { ...step, [field]: value } : step)
    update(section.id, { steps: next })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Label</label>
        <input className="pf-edit-input" value={label || ''} onChange={(e) => setField('label', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Título</label>
        <input className="pf-edit-input" value={title} onChange={(e) => setField('title', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Subtítulo</label>
        <textarea className="pf-edit-textarea" value={subtitle || ''} onChange={(e) => setField('subtitle', e.target.value)} />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Passos ({steps.length})</p>
      <div className="pf-edit-items">
        {steps.map((step, i) => (
          <div key={i} className="pf-edit-item pf-edit-item--col">
            <div className="pf-edit-item-row">
              <span className="pf-edit-step-num">{i + 1}</span>
              <input
                className="pf-edit-input"
                value={step.title}
                onChange={(e) => setStep(i, 'title', e.target.value)}
                placeholder="Título do passo"
              />
            </div>
            <textarea
              className="pf-edit-textarea pf-edit-textarea--sm"
              value={step.description}
              onChange={(e) => setStep(i, 'description', e.target.value)}
              placeholder="Descrição"
            />
          </div>
        ))}
      </div>

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   TestimonialsEditPanel
   ═══════════════════════════════════════════════════════ */
function TestimonialsEditPanel({ section }: { section: Extract<Section, { type: 'testimonials' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const { variant, label, title, items, style } = section.props

  function setField(field: string, value: string) {
    update(section.id, { [field]: value })
  }

  function setItem(i: number, field: string, value: string) {
    const next = items.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    update(section.id, { items: next })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Variante</label>
        <select
          className="pf-edit-select"
          value={variant}
          onChange={(e) => setField('variant', e.target.value)}
        >
          <option value="grid">Grade</option>
          <option value="single">Destaque único</option>
        </select>
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Label</label>
        <input className="pf-edit-input" value={label || ''} onChange={(e) => setField('label', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Título</label>
        <input className="pf-edit-input" value={title || ''} onChange={(e) => setField('title', e.target.value)} />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Depoimentos ({items.length})</p>
      <div className="pf-edit-items">
        {items.map((item, i) => (
          <div key={i} className="pf-edit-item pf-edit-item--col">
            <div className="pf-edit-group" style={{ marginBottom: 8 }}>
              <label className="pf-edit-group__label">Depoimento</label>
              <textarea
                className="pf-edit-textarea"
                value={item.quote}
                onChange={(e) => setItem(i, 'quote', e.target.value)}
                placeholder="Texto do depoimento"
              />
            </div>
            <div className="pf-edit-item-row">
              <input
                className="pf-edit-input"
                value={item.authorName}
                onChange={(e) => setItem(i, 'authorName', e.target.value)}
                placeholder="Nome"
              />
              <input
                className="pf-edit-input"
                value={item.authorRole}
                onChange={(e) => setItem(i, 'authorRole', e.target.value)}
                placeholder="Cargo"
              />
            </div>
            <input
              className="pf-edit-input"
              value={item.authorCompany || ''}
              onChange={(e) => setItem(i, 'authorCompany', e.target.value)}
              placeholder="Empresa (opcional)"
            />
          </div>
        ))}
      </div>

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   PricingEditPanel
   ═══════════════════════════════════════════════════════ */
function PricingEditPanel({ section }: { section: Extract<Section, { type: 'pricing' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const { label, title, subtitle, plans, style } = section.props

  function setField(field: string, value: string) {
    update(section.id, { [field]: value })
  }

  function setPlan(i: number, field: string, value: string) {
    const next = plans.map((plan, idx) => idx === i ? { ...plan, [field]: value } : plan)
    update(section.id, { plans: next })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Label</label>
        <input className="pf-edit-input" value={label || ''} onChange={(e) => setField('label', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Título</label>
        <input className="pf-edit-input" value={title} onChange={(e) => setField('title', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Subtítulo</label>
        <textarea className="pf-edit-textarea" value={subtitle || ''} onChange={(e) => setField('subtitle', e.target.value)} />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Planos ({plans.length})</p>
      <div className="pf-edit-items">
        {plans.map((plan, i) => (
          <div key={i} className="pf-edit-item pf-edit-item--col">
            <div className="pf-edit-item-row">
              <input
                className="pf-edit-input"
                value={plan.name}
                onChange={(e) => setPlan(i, 'name', e.target.value)}
                placeholder="Nome do plano"
              />
              <input
                className="pf-edit-input pf-edit-input--sm"
                value={plan.price}
                onChange={(e) => setPlan(i, 'price', e.target.value)}
                placeholder="R$ 97"
              />
            </div>
            <div className="pf-edit-item-row">
              <input
                className="pf-edit-input"
                value={plan.ctaText}
                onChange={(e) => setPlan(i, 'ctaText', e.target.value)}
                placeholder="Texto do botão"
              />
              <input
                className="pf-edit-input"
                value={plan.ctaUrl}
                onChange={(e) => setPlan(i, 'ctaUrl', e.target.value)}
                placeholder="URL"
              />
            </div>
          </div>
        ))}
      </div>

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   FAQEditPanel
   ═══════════════════════════════════════════════════════ */
function FAQEditPanel({ section }: { section: Extract<Section, { type: 'faq' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const { label, title, subtitle, items, style } = section.props

  function setField(field: string, value: string) {
    update(section.id, { [field]: value })
  }

  function setItem(i: number, field: 'question' | 'answer', value: string) {
    const next = items.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    update(section.id, { items: next })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Label</label>
        <input className="pf-edit-input" value={label || ''} onChange={(e) => setField('label', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Título</label>
        <input className="pf-edit-input" value={title} onChange={(e) => setField('title', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Subtítulo</label>
        <textarea className="pf-edit-textarea" value={subtitle || ''} onChange={(e) => setField('subtitle', e.target.value)} />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Perguntas ({items.length})</p>
      <div className="pf-edit-items">
        {items.map((item, i) => (
          <div key={i} className="pf-edit-item pf-edit-item--col">
            <input
              className="pf-edit-input"
              value={item.question}
              onChange={(e) => setItem(i, 'question', e.target.value)}
              placeholder="Pergunta"
            />
            <textarea
              className="pf-edit-textarea pf-edit-textarea--sm"
              value={item.answer}
              onChange={(e) => setItem(i, 'answer', e.target.value)}
              placeholder="Resposta"
            />
          </div>
        ))}
      </div>

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   CTAEditPanel
   ═══════════════════════════════════════════════════════ */
function CTAEditPanel({ section }: { section: Extract<Section, { type: 'cta' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const { variant, headline, subheadline, primaryCtaText, primaryCtaUrl, secondaryCtaText, secondaryCtaUrl, style } = section.props

  function setField(field: string, value: string) {
    update(section.id, { [field]: value })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Variante</label>
        <select
          className="pf-edit-select"
          value={variant}
          onChange={(e) => setField('variant', e.target.value)}
        >
          <option value="centered">Centralizado</option>
          <option value="card">Card</option>
        </select>
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Título</label>
        <input className="pf-edit-input" value={headline} onChange={(e) => setField('headline', e.target.value)} />
      </div>

      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Subtítulo</label>
        <textarea
          className="pf-edit-textarea"
          value={subheadline || ''}
          onChange={(e) => setField('subheadline', e.target.value)}
        />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Botão primário</p>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Texto</label>
        <input className="pf-edit-input" value={primaryCtaText} onChange={(e) => setField('primaryCtaText', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">URL</label>
        <input className="pf-edit-input" value={primaryCtaUrl} onChange={(e) => setField('primaryCtaUrl', e.target.value)} placeholder="https://..." />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Botão secundário</p>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Texto</label>
        <input
          className="pf-edit-input"
          value={secondaryCtaText || ''}
          onChange={(e) => setField('secondaryCtaText', e.target.value)}
          placeholder="Opcional"
        />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">URL</label>
        <input
          className="pf-edit-input"
          value={secondaryCtaUrl || ''}
          onChange={(e) => setField('secondaryCtaUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   FooterEditPanel
   ═══════════════════════════════════════════════════════ */
function FooterEditPanel({ section }: { section: Extract<Section, { type: 'footer' }> }) {
  const update = useEditorStore((s) => s.updateSectionProps)
  const { logo, tagline, columns, copyright, bottomLinks, style } = section.props

  function setField(field: string, value: string) {
    update(section.id, { [field]: value })
  }

  function setColumnTitle(colIdx: number, value: string) {
    const next = columns.map((col, i) => i === colIdx ? { ...col, title: value } : col)
    update(section.id, { columns: next })
  }

  function setLink(colIdx: number, linkIdx: number, field: 'label' | 'href', value: string) {
    const next = columns.map((col, i) => {
      if (i !== colIdx) return col
      const links = col.links.map((l, j) => j === linkIdx ? { ...l, [field]: value } : l)
      return { ...col, links }
    })
    update(section.id, { columns: next })
  }

  function setBottomLink(linkIdx: number, field: 'label' | 'href', value: string) {
    if (!bottomLinks) return
    const next = bottomLinks.map((l, i) => i === linkIdx ? { ...l, [field]: value } : l)
    update(section.id, { bottomLinks: next })
  }

  return (
    <>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Logo / Nome</label>
        <input className="pf-edit-input" value={logo || ''} onChange={(e) => setField('logo', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Tagline</label>
        <input className="pf-edit-input" value={tagline || ''} onChange={(e) => setField('tagline', e.target.value)} />
      </div>
      <div className="pf-edit-group">
        <label className="pf-edit-group__label">Copyright</label>
        <input className="pf-edit-input" value={copyright} onChange={(e) => setField('copyright', e.target.value)} />
      </div>

      <div className="pf-edit-divider" />
      <p className="pf-edit-section-title">Colunas de links</p>
      <div className="pf-edit-items">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="pf-edit-item pf-edit-item--col">
            <input
              className="pf-edit-input"
              value={col.title}
              onChange={(e) => setColumnTitle(colIdx, e.target.value)}
              placeholder="Título da coluna"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
              {col.links.map((link, linkIdx) => (
                <div key={linkIdx} className="pf-edit-item-row">
                  <input
                    className="pf-edit-input"
                    value={link.label}
                    onChange={(e) => setLink(colIdx, linkIdx, 'label', e.target.value)}
                    placeholder="Label"
                  />
                  <input
                    className="pf-edit-input"
                    value={link.href}
                    onChange={(e) => setLink(colIdx, linkIdx, 'href', e.target.value)}
                    placeholder="URL"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {bottomLinks && bottomLinks.length > 0 && (
        <>
          <div className="pf-edit-divider" />
          <p className="pf-edit-section-title">Links inferiores</p>
          <div className="pf-edit-items">
            {bottomLinks.map((link, linkIdx) => (
              <div key={linkIdx} className="pf-edit-item-row">
                <input
                  className="pf-edit-input"
                  value={link.label}
                  onChange={(e) => setBottomLink(linkIdx, 'label', e.target.value)}
                  placeholder="Label"
                />
                <input
                  className="pf-edit-input"
                  value={link.href}
                  onChange={(e) => setBottomLink(linkIdx, 'href', e.target.value)}
                  placeholder="URL"
                />
              </div>
            ))}
          </div>
        </>
      )}

      <StyleBlock sectionId={section.id} style={style} update={(p) => update(section.id, p)} />
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   Router
   ═══════════════════════════════════════════════════════ */
function renderSectionForm(section: Section) {
  switch (section.type) {
    case 'navbar':       return <NavbarEditPanel       section={section} />
    case 'hero':         return <HeroEditPanel         section={section} />
    case 'logos':        return <LogosEditPanel        section={section} />
    case 'features':     return <FeaturesEditPanel     section={section} />
    case 'benefits':     return <BenefitsEditPanel     section={section} />
    case 'steps':        return <StepsEditPanel        section={section} />
    case 'testimonials': return <TestimonialsEditPanel section={section} />
    case 'pricing':      return <PricingEditPanel      section={section} />
    case 'faq':          return <FAQEditPanel          section={section} />
    case 'cta':          return <CTAEditPanel          section={section} />
    case 'footer':       return <FooterEditPanel       section={section} />
    default:             return null
  }
}

/* ═══════════════════════════════════════════════════════
   SectionEditPanel — componente principal exportado
   ═══════════════════════════════════════════════════════ */
export function SectionEditPanel() {
  const activeSectionId = useEditorStore((s) => s.activeSectionId)
  const sections        = useEditorStore((s) => s.sections)
  const setActiveSectionId = useEditorStore((s) => s.setActiveSectionId)

  const activeSection = sections.find((s) => s.id === activeSectionId)
  if (!activeSection) return null

  const meta = SECTION_META[activeSection.type]
  const Icon = meta.Icon

  return (
    <div className="pf-edit-panel" key={activeSection.id}>
      <div className="pf-edit-panel__header">
        <div className="pf-edit-panel__icon">
          <Icon size={14} strokeWidth={1.75} />
        </div>
        <div className="pf-edit-panel__title-group">
          <span className="pf-edit-panel__title">{meta.label}</span>
          <span className="pf-edit-panel__subtitle">{meta.description}</span>
        </div>
        <button
          className="pf-edit-panel__close"
          onClick={() => setActiveSectionId(null)}
          title="Fechar painel"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>

      <div className="pf-edit-panel__body">
        {renderSectionForm(activeSection)}
      </div>
    </div>
  )
}

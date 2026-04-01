'use client'

import { Loader2, Check } from 'lucide-react'
import { TEMPLATES, type Template } from '@/lib/templates'
import type { SectionType } from '@/lib/types'
import './template-picker.css'

/* ── helpers ─────────────────────────────────────────── */

const SECTION_LABEL: Record<SectionType, string> = {
  navbar:       'Navbar',
  hero:         'Hero',
  logos:        'Logos',
  features:     'Features',
  benefits:     'Benefits',
  steps:        'Steps',
  testimonials: 'Depoimentos',
  pricing:      'Preços',
  faq:          'FAQ',
  cta:          'CTA',
  footer:       'Footer',
}

function getAccent(template: Template): string {
  const cta = template.content.sections.find((s) => s.type === 'cta')
  if (cta?.type === 'cta' && cta.props.style?.bgColor) return cta.props.style.bgColor
  return '#7F77DD'
}

/* ── component ───────────────────────────────────────── */

type Props = {
  applying: string | null
  ctaLabel?: string
  onUse: (template: Template) => void
}

export function TemplateGallery({ applying, ctaLabel = 'Usar este template', onUse }: Props) {
  return (
    <div className="pf-tpl-grid">
      {TEMPLATES.map((template) => {
        const accent = getAccent(template)
        const isApplying = applying === template.id
        const sectionLabels = template.content.sections.map((s) => SECTION_LABEL[s.type])

        return (
          <div key={template.id} className="pf-tpl-card">
            {/* Preview skeleton */}
            <div className="pf-tpl-card__preview">
              <div className="pf-tpl-card__preview-inner">
                <div className="pf-tpl-card__nav-bar" />
                <div className="pf-tpl-card__hero">
                  <div className="pf-tpl-card__hero-line --wide" />
                  <div className="pf-tpl-card__hero-line --narrow" />
                  <div className="pf-tpl-card__hero-btns">
                    <div
                      className="pf-tpl-card__hero-btn --primary"
                      style={{ background: accent }}
                    />
                    <div className="pf-tpl-card__hero-btn --ghost" />
                  </div>
                </div>
                <div className="pf-tpl-card__section-strip">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="pf-tpl-card__section-block" />
                  ))}
                </div>
              </div>
              <div className="pf-tpl-card__glow" style={{ background: accent }} />
            </div>

            {/* Body */}
            <div className="pf-tpl-card__body">
              <h3 className="pf-tpl-card__name">{template.name}</h3>
              <p className="pf-tpl-card__desc">{template.description}</p>
              <div className="pf-tpl-sections">
                {sectionLabels.map((label, i) => (
                  <span key={i} className="pf-tpl-section-pill">{label}</span>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="pf-tpl-card__footer">
              <button
                className="pf-tpl-use-btn"
                style={{ '--btn-color': accent } as React.CSSProperties}
                onClick={() => onUse(template)}
                disabled={!!applying}
              >
                {isApplying ? (
                  <>
                    <Loader2 size={14} className="pf-spinner" />
                    Aplicando...
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    {ctaLabel}
                  </>
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

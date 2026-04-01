'use client'

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { X, Globe, AlertCircle, Loader2, Check, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'
import './create-project-drawer.css'

/* ═══════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════ */

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Returns next available copy name: "Nome (cópia)", "Nome (cópia 2)", etc. */
function getCopyName(originalName: string, existingNames: string[]): string {
  const base = `${originalName} (cópia)`
  if (!existingNames.includes(base)) return base

  let n = 2
  while (n <= 100) {
    const candidate = `${originalName} (cópia ${n})`
    if (!existingNames.includes(candidate)) return candidate
    n++
  }
  return base
}

/** Returns next available copy slug: "slug-1", "slug-2", etc. */
async function findAvailableCopySlug(originalSlug: string): Promise<string> {
  let n = 1
  while (n <= 100) {
    const candidate = `${originalSlug}-${n}`
    const { data } = await supabase
      .from('projects')
      .select('slug')
      .eq('slug', candidate)
      .maybeSingle()
    if (!data) return candidate
    n++
  }
  return `${originalSlug}-${Date.now().toString(36).slice(-4)}`
}

async function isSlugTaken(slug: string): Promise<boolean> {
  if (!slug || slug.length < 3) return false
  const { data } = await supabase
    .from('projects')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()
  return !!data
}

/* ═══════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════ */

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken'

type Props = {
  project: Project | null
  existingProjects: Project[]
  onClose: () => void
  onDuplicated: () => void
}

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */

export function DuplicateProjectDrawer({
  project,
  existingProjects,
  onClose,
  onDuplicated,
}: Props) {
  const open = !!project

  const [copyName, setCopyName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle')
  const [errors, setErrors] = useState<{ slug?: string }>({})
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const slugCheckTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const abortRef = useRef(0)

  /* ── Initialize fields when project changes ── */
  useEffect(() => {
    if (!project) return

    abortRef.current++
    const token = abortRef.current

    const existingNames = existingProjects.map((p) => p.name)
    setCopyName(getCopyName(project.name, existingNames))
    setSlug('')
    setSlugStatus('checking')
    setErrors({})
    setLoading(false)

    findAvailableCopySlug(project.slug)
      .then((available) => {
        if (abortRef.current !== token) return
        setSlug(available)
        setSlugStatus('available')
      })
      .catch(() => {
        if (abortRef.current !== token) return
        setSlugStatus('idle')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id])

  /* ── Open / close animation ── */
  useEffect(() => {
    if (open) {
      setVisible(false)
      const raf = requestAnimationFrame(() => setVisible(true))
      document.body.style.overflow = 'hidden'
      return () => cancelAnimationFrame(raf)
    } else {
      setVisible(false)
      document.body.style.overflow = ''
    }
  }, [open])

  /* ── ESC key ── */
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleClose = useCallback(() => {
    if (loading) return
    setVisible(false)
    setTimeout(() => {
      abortRef.current++
      onClose()
    }, 350)
  }, [loading, onClose])

  /* ── Slug field ── */
  function handleSlugChange(e: ChangeEvent<HTMLInputElement>) {
    const formatted = toSlug(e.target.value)
    setSlug(formatted)
    setErrors({})

    if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current)

    if (formatted.length >= 3) {
      setSlugStatus('checking')
      const token = ++abortRef.current

      slugCheckTimer.current = setTimeout(async () => {
        try {
          const taken = await isSlugTaken(formatted)
          if (abortRef.current !== token) return
          if (taken) {
            setSlugStatus('taken')
            setErrors({ slug: 'Esta URL não está disponível. Selecione outra.' })
          } else {
            setSlugStatus('available')
          }
        } catch {
          if (abortRef.current !== token) return
          setSlugStatus('idle')
        }
      }, 400)
    } else {
      setSlugStatus('idle')
    }
  }

  /* ── Submit ── */
  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    if (!project || loading || slugStatus === 'checking') return

    if (!slug.trim() || slug.length < 3) {
      setErrors({ slug: 'O slug deve ter pelo menos 3 caracteres' })
      return
    }
    if (slugStatus === 'taken') {
      setErrors({ slug: 'Esta URL não está disponível. Selecione outra.' })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('projects').insert({
        name: copyName,
        slug: slug.trim(),
        user_id: project.user_id,
        status: 'draft',
        content: project.content,
      })
      if (error) throw error

      handleClose()
      onDuplicated()
    } catch {
      setErrors({ slug: 'Erro ao duplicar projeto. Tente novamente.' })
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!open) return null

  const isValid =
    slug.trim().length >= 3 &&
    slugStatus !== 'taken' &&
    slugStatus !== 'checking'

  return (
    <>
      {/* Overlay */}
      <div
        className={`pf-drawer-overlay ${visible ? '--visible' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`pf-drawer ${visible ? '--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Duplicar projeto"
      >
        {/* Header */}
        <div className="pf-drawer__header">
          <div className="pf-drawer__header-text">
            <h2>Duplicar projeto</h2>
            <p>A cópia será criada como rascunho</p>
          </div>
          <button
            className="pf-drawer__close"
            onClick={handleClose}
            aria-label="Fechar"
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="pf-drawer__separator" />

        {/* Body */}
        <form className="pf-drawer__body" onSubmit={handleSubmit} noValidate>
          {/* Nome da cópia (read-only) */}
          <div className="pf-field">
            <label className="pf-field__label">Nome da cópia</label>
            <div className="pf-duplicate-name">{copyName}</div>
            <div className="pf-field__helper">Gerado automaticamente</div>
          </div>

          {/* Slug */}
          <div className="pf-field">
            <label className="pf-field__label" htmlFor="duplicate-slug">
              Slug (URL) <span className="pf-field__required">*</span>
            </label>
            <div
              className={`pf-slug-group ${
                errors.slug
                  ? '--error'
                  : slugStatus === 'available'
                    ? '--success'
                    : ''
              }`}
            >
              <span className="pf-slug-prefix">ponforge.com/</span>
              <input
                id="duplicate-slug"
                className="pf-slug-input"
                type="text"
                placeholder="meu-projeto-1"
                value={slug}
                onChange={handleSlugChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                maxLength={60}
              />
              {slugStatus === 'checking' && (
                <span className="pf-slug-status">
                  <RefreshCw size={13} className="pf-slug-spinner" />
                </span>
              )}
              {slugStatus === 'available' && slug.length >= 3 && (
                <span className="pf-slug-status --available">
                  <Check size={13} />
                </span>
              )}
              {slugStatus === 'taken' && (
                <span className="pf-slug-status --taken">
                  <AlertCircle size={13} />
                </span>
              )}
            </div>

            {errors.slug ? (
              <div className="pf-field__error">
                <AlertCircle size={12} />
                {errors.slug}
              </div>
            ) : slugStatus === 'checking' ? (
              <div className="pf-field__helper" style={{ color: '#888' }}>
                Verificando disponibilidade...
              </div>
            ) : slugStatus === 'available' && slug.length >= 3 ? (
              <div className="pf-slug-preview --available">
                <Globe size={12} />
                <span className="pf-slug-preview__url">
                  ponforge.com/<span>{slug}</span>
                </span>
                <span className="pf-slug-preview__badge">disponível</span>
              </div>
            ) : (
              <div className="pf-field__helper">URL pública do projeto duplicado</div>
            )}
          </div>
        </form>

        {/* Keyboard hint */}
        <div className="pf-drawer__kbd-hint">
          <span className="pf-kbd">Enter</span>
          <span>para duplicar</span>
          <span style={{ margin: '0 4px', color: '#333' }}>·</span>
          <span className="pf-kbd">Esc</span>
          <span>para cancelar</span>
        </div>

        {/* Footer */}
        <div className="pf-drawer__footer">
          <button
            className="pf-btn-ghost"
            onClick={handleClose}
            type="button"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="pf-btn-primary"
            onClick={() => handleSubmit()}
            type="button"
            disabled={!isValid || loading}
          >
            {loading ? (
              <>
                <Loader2 size={15} className="pf-spinner" />
                <span>Duplicando...</span>
              </>
            ) : (
              <span>Duplicar projeto</span>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

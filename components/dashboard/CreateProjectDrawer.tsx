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
import './create-project-drawer.css'

/* ═════════════════════════════════════════════════════════
   Helpers
   ═════════════════════════════════════════════════════════ */

/** Converts a project name into a URL-safe slug */
function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .trim()
    .replace(/\s+/g, '-')           // spaces → hyphens
    .replace(/-+/g, '-')            // consecutive hyphens
}

/**
 * Checks if a slug exists in the DB.
 * If auto-generated, finds the next available with numeric suffix.
 * Returns the available slug.
 */
async function findAvailableSlug(baseSlug: string): Promise<string> {
  if (!baseSlug) return ''

  // Check if base slug is available
  const { data } = await supabase
    .from('projects')
    .select('slug')
    .eq('slug', baseSlug)
    .maybeSingle()

  if (!data) return baseSlug // available!

  // Slug taken → try incrementing
  let attempt = 2
  while (attempt <= 100) {
    const candidate = `${baseSlug}${attempt}`
    const { data: found } = await supabase
      .from('projects')
      .select('slug')
      .eq('slug', candidate)
      .maybeSingle()

    if (!found) return candidate
    attempt++
  }

  // Fallback: append random
  return `${baseSlug}-${Date.now().toString(36).slice(-4)}`
}

/** Check if a specific slug is taken */
async function isSlugTaken(slug: string): Promise<boolean> {
  if (!slug || slug.length < 3) return false
  const { data } = await supabase
    .from('projects')
    .select('slug')
    .eq('slug', slug)
    .maybeSingle()
  return !!data
}

/* ═════════════════════════════════════════════════════════
   Types
   ═════════════════════════════════════════════════════════ */

export type CreateProjectPayload = {
  name: string
  slug: string
}

type CreateProjectDrawerProps = {
  open: boolean
  onClose: () => void
  onCreateProject: (data: CreateProjectPayload) => Promise<void>
  title?: string
  subtitle?: string
}

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken'

/* ═════════════════════════════════════════════════════════
   Component
   ═════════════════════════════════════════════════════════ */

export function CreateProjectDrawer({
  open,
  onClose,
  onCreateProject,
  title = 'Criar novo projeto',
  subtitle = 'Comece sua nova landing page',
}: CreateProjectDrawerProps) {
  /* ─── state ────────────────────────────────────────── */
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle')
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({})
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const nameRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const slugCheckTimer = useRef<ReturnType<typeof setTimeout>>(null)
  const abortRef = useRef(0) // to discard stale async results

  /* ─── open/close animation ─────────────────────────── */
  useEffect(() => {
    if (open) {
      setVisible(false)
      const raf = requestAnimationFrame(() => setVisible(true))
      setTimeout(() => nameRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
      return () => cancelAnimationFrame(raf)
    } else {
      setVisible(false)
      document.body.style.overflow = ''
    }
  }, [open])

  /* ─── ESC key ──────────────────────────────────────── */
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  /* ─── close handler (with exit animation) ──────────── */
  const handleClose = useCallback(() => {
    if (loading) return
    setVisible(false)
    setTimeout(() => {
      setName('')
      setSlug('')
      setSlugTouched(false)
      setSlugStatus('idle')
      setErrors({})
      setLoading(false)
      abortRef.current++
      onClose()
    }, 350)
  }, [loading, onClose])

  /* ─── auto-slug from name (with availability check) ── */
  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setName(val)
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))

    if (!slugTouched) {
      const baseSlug = toSlug(val)
      setSlug(baseSlug)

      // Debounced availability check + auto-increment
      if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current)

      if (baseSlug.length >= 3) {
        setSlugStatus('checking')
        const token = ++abortRef.current

        slugCheckTimer.current = setTimeout(async () => {
          try {
            const available = await findAvailableSlug(baseSlug)
            if (abortRef.current !== token) return // stale
            setSlug(available)
            setSlugStatus('available')
            setErrors((prev) => ({ ...prev, slug: undefined }))
          } catch {
            if (abortRef.current !== token) return
            setSlugStatus('idle')
          }
        }, 400)
      } else {
        setSlugStatus('idle')
      }
    }
  }

  /* ─── manual slug edit (with availability check) ───── */
  function handleSlugChange(e: ChangeEvent<HTMLInputElement>) {
    setSlugTouched(true)
    const raw = e.target.value
    const formatted = toSlug(raw)
    setSlug(formatted)
    if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }))

    // Debounced check
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
            setErrors((prev) => ({
              ...prev,
              slug: 'Esta URL não está disponível. Selecione outra.',
            }))
          } else {
            setSlugStatus('available')
            setErrors((prev) => ({ ...prev, slug: undefined }))
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

  /* ─── validation ───────────────────────────────────── */
  function validate(): boolean {
    const errs: { name?: string; slug?: string } = {}

    if (!name.trim()) {
      errs.name = 'O nome do projeto é obrigatório'
    } else if (name.trim().length < 3) {
      errs.name = 'O nome deve ter pelo menos 3 caracteres'
    }

    if (!slug.trim()) {
      errs.slug = 'O slug é obrigatório'
    } else if (slug.length < 3) {
      errs.slug = 'O slug deve ter pelo menos 3 caracteres'
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      errs.slug = 'Use apenas letras minúsculas, números e hifens'
    } else if (slugStatus === 'taken') {
      errs.slug = 'Esta URL não está disponível. Selecione outra.'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  /* ─── submit ───────────────────────────────────────── */
  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    if (loading || slugStatus === 'checking') return
    if (!validate()) return

    setLoading(true)
    try {
      await onCreateProject({ name: name.trim(), slug: slug.trim() })
      handleClose()
    } catch {
      setErrors({ slug: 'Erro ao criar projeto. Tente novamente.' })
      setLoading(false)
    }
  }

  /* ─── Enter key to submit ──────────────────────────── */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  /* ─── render ───────────────────────────────────────── */
  if (!open) return null

  const isValid =
    name.trim().length >= 3 &&
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

      {/* Drawer Panel */}
      <div
        ref={panelRef}
        className={`pf-drawer ${visible ? '--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Criar novo projeto"
      >
        {/* ── Header ─────────────────────────────────── */}
        <div className="pf-drawer__header">
          <div className="pf-drawer__header-text">
            <h2>{title}</h2>
            <p>{subtitle}</p>
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

        {/* ── Body / Form ────────────────────────────── */}
        <form
          className="pf-drawer__body"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Name field */}
          <div className="pf-field">
            <label className="pf-field__label" htmlFor="project-name">
              Nome do projeto <span className="pf-field__required">*</span>
            </label>
            <input
              ref={nameRef}
              id="project-name"
              className={`pf-input ${errors.name ? '--error' : ''}`}
              type="text"
              placeholder="Ex: Landing Black Friday"
              value={name}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              maxLength={80}
            />
            {errors.name ? (
              <div className="pf-field__error">
                <AlertCircle size={12} />
                {errors.name}
              </div>
            ) : (
              <div className="pf-field__helper">
                {name.length}/80 caracteres
              </div>
            )}
          </div>

          {/* Slug field */}
          <div className="pf-field">
            <label className="pf-field__label" htmlFor="project-slug">
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
                id="project-slug"
                className="pf-slug-input"
                type="text"
                placeholder="meu-projeto"
                value={slug}
                onChange={handleSlugChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                maxLength={60}
              />
              {/* Status indicator inside input */}
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

            {/* Slug feedback */}
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
              <div className="pf-field__helper">
                Gerado automaticamente a partir do nome
              </div>
            )}
          </div>
        </form>

        {/* ── Keyboard hint ──────────────────────────── */}
        <div className="pf-drawer__kbd-hint">
          <span className="pf-kbd">Enter</span>
          <span>para criar</span>
          <span style={{ margin: '0 4px', color: '#333' }}>·</span>
          <span className="pf-kbd">Esc</span>
          <span>para cancelar</span>
        </div>

        {/* ── Footer / Actions ───────────────────────── */}
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
                <span>Criando...</span>
              </>
            ) : (
              <span>Criar projeto</span>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

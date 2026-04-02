'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Globe,
  Loader2,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react'
import type { Project } from '@/lib/types'

/* ─── helpers ─────────────────────────────────────────── */
function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min atrás`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h atrás`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d atrás`
  return formatDate(iso)
}

type MenuState = 'idle' | 'confirming-delete' | 'renaming' | 'confirming-unpublish'

/* ─── component ───────────────────────────────────────── */
export function ProjectCard({
  project,
  onDelete,
  onDuplicate,
  onRename,
  onUnpublish,
}: {
  project: Project
  onDelete: () => Promise<void>
  onDuplicate: () => void
  onRename: (newName: string) => Promise<void>
  onUnpublish: () => Promise<void>
}) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuState, setMenuState] = useState<MenuState>('idle')
  const [deleting, setDeleting] = useState(false)
  const [unpublishing, setUnpublishing] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const [renaming, setRenaming] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const renameInputRef = useRef<HTMLInputElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setMenuState('idle')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Focus rename input when entering rename state
  useEffect(() => {
    if (menuState === 'renaming') {
      setTimeout(() => renameInputRef.current?.focus(), 0)
    }
  }, [menuState])

  function closeMenu() {
    setMenuOpen(false)
    setMenuState('idle')
  }

  function openRename() {
    setRenameValue(project.name)
    setMenuState('renaming')
  }

  async function handleConfirmDelete() {
    setDeleting(true)
    try {
      await onDelete()
    } catch {
      setDeleting(false)
      setMenuState('idle')
    }
  }

  async function handleConfirmUnpublish() {
    setUnpublishing(true)
    try {
      await onUnpublish()
      closeMenu()
    } catch {
      setUnpublishing(false)
    }
  }

  async function handleConfirmRename() {
    const trimmed = renameValue.trim()
    if (!trimmed || trimmed === project.name || trimmed.length < 3) return
    setRenaming(true)
    try {
      await onRename(trimmed)
      closeMenu()
    } catch {
      setRenaming(false)
    }
  }

  function handleRenameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleConfirmRename()
    }
    if (e.key === 'Escape') {
      closeMenu()
    }
  }

  const isDraft = project.status === 'draft'
  const sectionCount = project.content?.sections?.length ?? 0

  const renameValid =
    renameValue.trim().length >= 3 && renameValue.trim() !== project.name

  return (
    <div
      className="pf-project-card"
      onClick={() => router.push(`/editor/${project.id}`)}
    >
      {/* Three-dot menu */}
      <div
        className="pf-project-card__actions"
        ref={menuRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="pf-project-card__actions-btn"
          onClick={() => {
            setMenuOpen(!menuOpen)
            setMenuState('idle')
          }}
          aria-label="Ações do projeto"
        >
          <MoreHorizontal size={15} />
        </button>

        {menuOpen && (
          <div className="pf-dropdown">
            {menuState === 'idle' && (
              <>
                <button className="pf-dropdown__item" onClick={openRename}>
                  <Pencil size={14} />
                  Renomear
                </button>
                <button
                  className="pf-dropdown__item"
                  onClick={() => { closeMenu(); onDuplicate() }}
                >
                  <Copy size={14} />
                  Duplicar
                </button>

                {/* Ver online — só se publicado */}
                {!isDraft && (
                  <a
                    className="pf-dropdown__item"
                    href={`/p/${project.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    style={{ textDecoration: 'none' }}
                  >
                    <ExternalLink size={14} />
                    Ver online
                  </a>
                )}

                {/* Despublicar — só se publicado */}
                {!isDraft && (
                  <>
                    <div className="pf-dropdown__divider" />
                    <button
                      className="pf-dropdown__item"
                      onClick={() => setMenuState('confirming-unpublish')}
                    >
                      <Globe size={14} />
                      Despublicar
                    </button>
                  </>
                )}

                <div className="pf-dropdown__divider" />
                <button
                  className="pf-dropdown__item --danger"
                  onClick={() => setMenuState('confirming-delete')}
                >
                  <Trash2 size={14} />
                  Excluir
                </button>
              </>
            )}

            {menuState === 'renaming' && (
              <div className="pf-dropdown__rename">
                <p className="pf-dropdown__rename-label">Renomear projeto</p>
                <input
                  ref={renameInputRef}
                  className="pf-dropdown__rename-input"
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={handleRenameKeyDown}
                  maxLength={80}
                  autoComplete="off"
                />
                <div className="pf-dropdown__confirm-actions">
                  <button
                    className="pf-dropdown__confirm-cancel"
                    onClick={closeMenu}
                    disabled={renaming}
                  >
                    <X size={12} />
                    Cancelar
                  </button>
                  <button
                    className="pf-dropdown__confirm-save"
                    onClick={handleConfirmRename}
                    disabled={!renameValid || renaming}
                  >
                    {renaming ? (
                      <Loader2 size={12} className="pf-spinner" />
                    ) : (
                      <Check size={12} />
                    )}
                    {renaming ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            )}

            {menuState === 'confirming-unpublish' && (
              <div className="pf-dropdown__confirm">
                <div className="pf-dropdown__confirm-icon">
                  <Globe size={15} />
                </div>
                <p className="pf-dropdown__confirm-text">
                  Despublicar <strong>{project.name}</strong>? A página ficará offline.
                </p>
                <div className="pf-dropdown__confirm-actions">
                  <button
                    className="pf-dropdown__confirm-cancel"
                    onClick={() => setMenuState('idle')}
                    disabled={unpublishing}
                  >
                    Cancelar
                  </button>
                  <button
                    className="pf-dropdown__confirm-delete"
                    onClick={handleConfirmUnpublish}
                    disabled={unpublishing}
                  >
                    {unpublishing ? (
                      <Loader2 size={12} className="pf-spinner" />
                    ) : (
                      <Globe size={12} />
                    )}
                    {unpublishing ? 'Despublicando...' : 'Despublicar'}
                  </button>
                </div>
              </div>
            )}

            {menuState === 'confirming-delete' && (
              <div className="pf-dropdown__confirm">
                <div className="pf-dropdown__confirm-icon">
                  <AlertTriangle size={15} />
                </div>
                <p className="pf-dropdown__confirm-text">
                  Excluir <strong>{project.name}</strong>? Esta ação não pode ser desfeita.
                </p>
                <div className="pf-dropdown__confirm-actions">
                  <button
                    className="pf-dropdown__confirm-cancel"
                    onClick={() => setMenuState('idle')}
                    disabled={deleting}
                  >
                    Cancelar
                  </button>
                  <button
                    className="pf-dropdown__confirm-delete"
                    onClick={handleConfirmDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <Loader2 size={12} className="pf-spinner" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    {deleting ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail */}
      <div className="pf-project-card__thumb">
        <div className="pf-project-card__thumb-placeholder">
          <Globe size={36} />
        </div>

        {/* Hover overlay */}
        <div className="pf-project-card__overlay">
          <button className="pf-project-card__overlay-btn">
            <Pencil size={14} />
            Editar projeto
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="pf-project-card__body">
        <div className="pf-project-card__top">
          <h3 className="pf-project-card__name">{project.name}</h3>
          <span className={`pf-badge ${isDraft ? '--draft' : '--published'}`}>
            <span className="pf-badge__dot" />
            {isDraft ? 'Rascunho' : 'Publicado'}
          </span>
        </div>

        <div className="pf-project-card__meta">
          <span>{relativeTime(project.updated_at)}</span>
          <span className="pf-project-card__meta-divider" />
          <span>
            {sectionCount} {sectionCount === 1 ? 'seção' : 'seções'}
          </span>
        </div>
      </div>
    </div>
  )
}

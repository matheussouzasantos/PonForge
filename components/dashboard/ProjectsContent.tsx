'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, FolderOpen } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import {
  CreateProjectDrawer,
  type CreateProjectPayload,
} from './CreateProjectDrawer'
import { DuplicateProjectDrawer } from './DuplicateProjectDrawer'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/types'
import './projects.css'

type FilterType = 'all' | 'draft' | 'published'

export function ProjectsContent({ projects, userId }: { projects: Project[]; userId: string }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [duplicatingProject, setDuplicatingProject] = useState<Project | null>(null)

  /* ─── derived ──────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = projects

    // Status filter
    if (filter === 'draft') list = list.filter((p) => p.status === 'draft')
    if (filter === 'published') list = list.filter((p) => p.status === 'published')

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }

    // Sort by updated_at desc
    return list.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  }, [projects, search, filter])

  const draftCount = projects.filter((p) => p.status === 'draft').length
  const publishedCount = projects.filter((p) => p.status === 'published').length

  /* ─── create project ────────────────────────────────── */
  async function handleCreateProject(data: CreateProjectPayload) {
    const { error } = await supabase
      .from('projects')
      .insert({
        name: data.name,
        slug: data.slug,
        user_id: userId,
        status: 'draft',
        content: { sections: [] },
      })

    if (error) throw new Error(error.message)

    router.refresh()
  }

  /* ─── delete project ─────────────────────────────────── */
  async function handleDeleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw new Error(error.message)

    router.refresh()
  }

  /* ─── rename project ─────────────────────────────────── */
  async function handleRenameProject(id: string, newName: string) {
    const { error } = await supabase
      .from('projects')
      .update({ name: newName, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(error.message)

    router.refresh()
  }

  /* ─── unpublish project ──────────────────────────────── */
  async function handleUnpublishProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .update({ status: 'draft', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw new Error(error.message)

    router.refresh()
  }

  /* ─── render ───────────────────────────────────────── */
  return (
    <>
      {/* ── Header ──────────────────────────────────── */}
      <div className="pf-projects-header">
        <div className="pf-projects-header__info">
          <h1>Seus projetos</h1>
          <p>Gerencie, edite e publique suas landing pages</p>
        </div>
        <button
          className="pf-btn-primary"
          onClick={() => setDrawerOpen(true)}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Criar novo projeto</span>
        </button>
      </div>

      {/* ── Content ─────────────────────────────────── */}
      {projects.length === 0 ? (
        /* Empty state */
        <div className="pf-empty-state">
          <div className="pf-empty-state__icon-ring">
            <FolderOpen size={32} />
          </div>
          <h2>Nenhum projeto ainda</h2>
          <p>
            Crie seu primeiro projeto e comece a construir landing pages
            incríveis com o poder do PonForge.
          </p>
          <button
            className="pf-btn-primary"
            onClick={() => setDrawerOpen(true)}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Criar seu primeiro projeto</span>
          </button>
        </div>
      ) : (
        <>
          {/* ── Toolbar: search + filters ─────────── */}
          <div className="pf-projects-toolbar">
            <div className="pf-search-box">
              <Search size={15} className="pf-search-box__icon" />
              <input
                className="pf-search-box__input"
                type="text"
                placeholder="Buscar projetos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="pf-filter-pills">
              <button
                className={`pf-filter-pill ${filter === 'all' ? '--active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Todos ({projects.length})
              </button>
              <button
                className={`pf-filter-pill ${filter === 'draft' ? '--active' : ''}`}
                onClick={() => setFilter('draft')}
              >
                Rascunhos ({draftCount})
              </button>
              <button
                className={`pf-filter-pill ${filter === 'published' ? '--active' : ''}`}
                onClick={() => setFilter('published')}
              >
                Publicados ({publishedCount})
              </button>
            </div>
          </div>

          {/* ── Result count ─────────────────────── */}
          <div className="pf-projects-count">
            Exibindo <span>{filtered.length}</span>{' '}
            {filtered.length === 1 ? 'projeto' : 'projetos'}
          </div>

          {/* ── Grid ─────────────────────────────── */}
          {filtered.length > 0 ? (
            <div className="pf-projects-grid">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={() => handleDeleteProject(project.id)}
                  onDuplicate={() => setDuplicatingProject(project)}
                  onRename={(newName) => handleRenameProject(project.id, newName)}
                  onUnpublish={() => handleUnpublishProject(project.id)}
                />
              ))}
            </div>
          ) : (
            <div className="pf-empty-state" style={{ padding: '48px 24px' }}>
              <Search size={28} style={{ color: '#555', marginBottom: 16 }} />
              <h2 style={{ fontSize: 17 }}>Nenhum resultado</h2>
              <p style={{ marginBottom: 0 }}>
                Nenhum projeto encontrado para &ldquo;{search}&rdquo;
              </p>
            </div>
          )}
        </>
      )}

      {/* ── Create Project Drawer ────────────────────── */}
      <CreateProjectDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* ── Duplicate Project Drawer ─────────────────── */}
      <DuplicateProjectDrawer
        project={duplicatingProject}
        existingProjects={projects}
        onClose={() => setDuplicatingProject(null)}
        onDuplicated={() => router.refresh()}
      />
    </>
  )
}

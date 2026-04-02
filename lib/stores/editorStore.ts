import { create } from 'zustand'
import type { Section, SectionType } from '@/lib/types'
import { createDefaultSection } from '@/lib/editor/defaultSections'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface EditorStore {
  projectId: string
  sections: Section[]
  activeSectionId: string | null
  saveStatus: SaveStatus
  isDirty: boolean
  init: (projectId: string, sections: Section[]) => void
  addSection: (type: SectionType) => void
  removeSection: (id: string) => void
  reorderSections: (sections: Section[]) => void
  setActiveSectionId: (id: string | null) => void
  updateSectionProps: (id: string, props: Record<string, unknown>) => void
  setSaveStatus: (status: SaveStatus) => void
  setDirty: (dirty: boolean) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  projectId: '',
  sections: [],
  activeSectionId: null,
  saveStatus: 'idle',
  isDirty: false,

  init(projectId, sections) {
    set({ projectId, sections, activeSectionId: null, isDirty: false, saveStatus: 'idle' })
  },

  addSection(type) {
    const section = createDefaultSection(type)
    set((state) => ({ sections: [...state.sections, section], isDirty: true }))
  },

  removeSection(id) {
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
      activeSectionId: state.activeSectionId === id ? null : state.activeSectionId,
      isDirty: true,
    }))
  },

  reorderSections(sections) {
    set({ sections, isDirty: true })
  },

  setActiveSectionId(id) {
    set({ activeSectionId: id })
  },

  updateSectionProps(id, props) {
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, props: { ...s.props, ...props } } as Section : s
      ),
      isDirty: true,
    }))
  },

  setSaveStatus(status) {
    set({ saveStatus: status })
  },

  setDirty(dirty) {
    set({ isDirty: dirty })
  },
}))

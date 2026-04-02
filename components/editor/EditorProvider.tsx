'use client'

import { useRef } from 'react'
import type { Section } from '@/lib/types'
import { useEditorStore } from '@/lib/stores/editorStore'

interface EditorProviderProps {
  projectId: string
  initialSections: Section[]
  children: React.ReactNode
}

export function EditorProvider({ projectId, initialSections, children }: EditorProviderProps) {
  const initialized = useRef(false)
  if (!initialized.current) {
    useEditorStore.getState().init(projectId, initialSections)
    initialized.current = true
  }

  return <>{children}</>
}

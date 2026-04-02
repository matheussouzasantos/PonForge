'use client'

import { useEditorStore } from '@/lib/stores/editorStore'
import { PageRenderer } from '@/components/renderer/PageRenderer'

export function EditorCanvas() {
  const sections = useEditorStore((s) => s.sections)
  return <PageRenderer sections={sections} />
}

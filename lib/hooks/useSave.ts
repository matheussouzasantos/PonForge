'use client'

import { useEditorStore } from '@/lib/stores/editorStore'
import { supabase } from '@/lib/supabase'

export function useSave(projectId: string) {
  const sections = useEditorStore((s) => s.sections)
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus)
  const setDirty = useEditorStore((s) => s.setDirty)

  async function save(): Promise<boolean> {
    setSaveStatus('saving')
    try {
      const { error } = await supabase
        .from('projects')
        .update({ content: { sections }, updated_at: new Date().toISOString() })
        .eq('id', projectId)
      if (error) throw error
      setSaveStatus('saved')
      setDirty(false)
      return true
    } catch {
      setSaveStatus('error')
      return false
    }
  }

  async function publish(): Promise<boolean> {
    setSaveStatus('saving')
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          content: { sections },
          status: 'published',
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
      if (error) throw error
      setSaveStatus('saved')
      setDirty(false)
      return true
    } catch {
      setSaveStatus('error')
      return false
    }
  }

  return { save, publish }
}

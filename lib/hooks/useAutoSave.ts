'use client'

import { useEffect, useRef } from 'react'
import { useEditorStore } from '@/lib/stores/editorStore'
import { supabase } from '@/lib/supabase'

const DEBOUNCE_MS = 500
const SAVED_RESET_MS = 2500

export function useAutoSave(projectId: string) {
  const sections = useEditorStore((s) => s.sections)
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Ignora a montagem inicial — não salva o conteúdo carregado do servidor
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // Marca como "salvando" imediatamente ao detectar mudança
    setSaveStatus('saving')

    if (timerRef.current) clearTimeout(timerRef.current)
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)

    timerRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('projects')
          .update({
            content: { sections },
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId)

        if (error) throw error

        setSaveStatus('saved')

        // Volta para idle após SAVED_RESET_MS
        resetTimerRef.current = setTimeout(() => {
          setSaveStatus('idle')
        }, SAVED_RESET_MS)
      } catch {
        setSaveStatus('error')
      }
    }, DEBOUNCE_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections])
}

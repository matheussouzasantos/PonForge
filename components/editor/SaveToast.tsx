'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCheck } from 'lucide-react'
import { useEditorStore } from '@/lib/stores/editorStore'

export function SaveToast() {
  const saveStatus = useEditorStore((s) => s.saveStatus)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (saveStatus === 'saved') {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2800)
      return () => clearTimeout(t)
    }
  }, [saveStatus])

  if (!mounted || !visible) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99998,
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 16px',
        borderRadius: 99,
        background: 'rgba(22, 163, 74, 0.12)',
        border: '1px solid rgba(74, 222, 128, 0.3)',
        color: '#4ADE80',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'inherit',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        pointerEvents: 'none',
        animation: 'pf-toast-in 0.25s cubic-bezier(0.16,1,0.3,1)',
        whiteSpace: 'nowrap',
      }}
    >
      <CheckCheck size={14} />
      Alterações salvas
    </div>,
    document.body
  )
}

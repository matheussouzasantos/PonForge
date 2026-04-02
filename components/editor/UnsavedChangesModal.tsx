'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, LogOut, Save } from 'lucide-react'

interface UnsavedChangesModalProps {
  isSaving: boolean
  onLeave: () => void
  onSaveAndLeave: () => void
  onCancel: () => void
}

export function UnsavedChangesModal({
  isSaving,
  onLeave,
  onSaveAndLeave,
  onCancel,
}: UnsavedChangesModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '0 16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#18181B',
          border: '1px solid #2A2A2D',
          borderRadius: 18,
          padding: '28px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          animation: 'pf-modal-in 0.2s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Icon + texto */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FBBF24',
            flexShrink: 0,
          }}>
            <AlertTriangle size={20} strokeWidth={1.75} />
          </div>

          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#F5E6D3', lineHeight: 1.3 }}>
              Alterações não salvas
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#71717A', lineHeight: 1.6 }}>
              Você tem alterações que ainda não foram salvas. Se sair agora, elas serão perdidas.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Sair sem salvar */}
          <button
            disabled={isSaving}
            onClick={onLeave}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.08)',
              color: '#EF4444',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.5 : 1,
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (isSaving) return
              e.currentTarget.style.background = 'rgba(239,68,68,0.16)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
            }}
          >
            <LogOut size={13} />
            Sair sem salvar
          </button>

          {/* Salvar e sair */}
          <button
            disabled={isSaving}
            onClick={onSaveAndLeave}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              border: '1px solid #FF6A2B',
              background: '#FF6A2B',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              opacity: isSaving ? 0.7 : 1,
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (isSaving) return
              e.currentTarget.style.background = '#ff7d44'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FF6A2B'
            }}
          >
            <Save size={13} />
            {isSaving ? 'Salvando…' : 'Salvar e sair'}
          </button>
        </div>

        {/* Link cancelar */}
        <button
          onClick={onCancel}
          disabled={isSaving}
          style={{
            background: 'none',
            border: 'none',
            color: '#52525B',
            fontSize: 12,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            textAlign: 'center',
            marginTop: -8,
            padding: '4px 0',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#A1A1AA' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#52525B' }}
        >
          Continuar editando
        </button>
      </div>
    </div>,
    document.body
  )
}

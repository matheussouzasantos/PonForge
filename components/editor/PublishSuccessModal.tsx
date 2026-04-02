'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Copy, ExternalLink, Check, X } from 'lucide-react'

interface PublishSuccessModalProps {
  slug: string
  onClose: () => void
}

export function PublishSuccessModal({ slug, onClose }: PublishSuccessModalProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/p/${slug}`
      : `/p/${slug}`

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  async function copyUrl() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  if (!mounted) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '0 16px',
        animation: 'pf-modal-in 0.2s cubic-bezier(0.16,1,0.3,1)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#18181B',
          border: '1px solid #2A2A2D',
          borderRadius: 18,
          padding: '28px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          position: 'relative',
        }}
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 28,
            height: 28,
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: '#52525B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = '#A1A1AA'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#52525B'
          }}
        >
          <X size={14} />
        </button>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4ADE80',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={20} strokeWidth={1.75} />
          </div>

          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#F5E6D3', lineHeight: 1.3 }}>
              Projeto publicado!
            </p>
            <p style={{ margin: '5px 0 0', fontSize: 13, color: '#71717A', lineHeight: 1.5 }}>
              Sua página está online e acessível para qualquer pessoa.
            </p>
          </div>
        </div>

        {/* URL box */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid #2A2A2D',
            borderRadius: 10,
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              flex: 1,
              fontSize: 12,
              color: '#A1A1AA',
              fontFamily: 'var(--font-geist-mono), monospace',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
            }}
          >
            {url}
          </span>

          <button
            onClick={copyUrl}
            title={copied ? 'Copiado!' : 'Copiar URL'}
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              border: '1px solid #2A2A2D',
              background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
              color: copied ? '#4ADE80' : '#71717A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.15s, color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              if (copied) return
              e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
              e.currentTarget.style.color = '#D4D4D8'
            }}
            onMouseLeave={(e) => {
              if (copied) return
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.color = '#71717A'
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              border: '1px solid #2A2A2D',
              background: 'rgba(255,255,255,0.04)',
              color: '#A1A1AA',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.borderColor = '#3F3F46'
              e.currentTarget.style.color = '#F5E6D3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.borderColor = '#2A2A2D'
              e.currentTarget.style.color = '#A1A1AA'
            }}
          >
            Continuar editando
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              height: 38,
              borderRadius: 10,
              border: '1px solid #FF6A2B',
              background: 'linear-gradient(135deg, #FF6A2B 0%, #ff4f00 100%)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              textDecoration: 'none',
              boxShadow: '0 2px 12px rgba(255,106,43,0.35)',
              transition: 'filter 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = '' }}
          >
            <ExternalLink size={13} />
            Ver online
          </a>
        </div>
      </div>
    </div>,
    document.body
  )
}

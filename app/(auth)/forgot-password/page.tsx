'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleReset() {
    setError(null)

    if (!email) {
      setError('Informe seu e-mail.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#0B0B0C' }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-8 flex flex-col gap-5 text-center"
          style={{ background: '#1A1A1D', border: '1px solid #121214' }}
        >
          <div
            className="mx-auto flex items-center justify-center w-12 h-12 rounded-full"
            style={{ background: 'rgba(255, 106, 43, 0.15)' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                stroke="#FF6A2B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m22 6-10 7L2 6"
                stroke="#FF6A2B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold" style={{ color: '#F5E6D3' }}>
              E-mail enviado
            </h2>
            <p className="text-sm" style={{ color: '#A1A1AA' }}>
              Enviamos um link de redefinição para{' '}
              <span style={{ color: '#FF6A2B' }}>{email}</span>. Verifique sua
              caixa de entrada.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full rounded-lg py-3 text-sm font-semibold text-center transition-all block"
            style={{ background: '#FF6A2B', color: '#0B0B0C' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#FF7A3D')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#FF6A2B')}
          >
            Voltar ao login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0B0B0C' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 flex flex-col gap-6"
        style={{ background: '#1A1A1D', border: '1px solid #121214' }}
      >
        {/* Brand */}
        <div className="flex flex-col gap-1">
          <span
            className="text-2xl font-semibold tracking-tight"
            style={{ color: '#F5E6D3' }}
          >
            Esqueceu a senha?
          </span>
          <p className="text-sm" style={{ color: '#A1A1AA' }}>
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-lg px-4 py-3 text-sm"
            style={{
              background: 'rgba(255, 106, 43, 0.1)',
              border: '1px solid rgba(255, 106, 43, 0.3)',
              color: '#FF8C42',
            }}
          >
            {error}
          </div>
        )}

        {/* Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
            style={{ background: '#121214', border: '1px solid #2a2a2d', color: '#F5E6D3' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6A2B')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2d')}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleReset()}
          />
        </div>

        {/* CTA */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full rounded-lg py-3 text-sm font-semibold transition-all disabled:opacity-50"
          style={{ background: loading ? '#FF7A3D' : '#FF6A2B', color: '#0B0B0C' }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.background = '#FF7A3D'
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.background = '#FF6A2B'
          }}
        >
          {loading ? 'Enviando...' : 'Enviar link de redefinição'}
        </button>

        {/* Back to login */}
        <p className="text-center text-sm" style={{ color: '#A1A1AA' }}>
          Lembrou a senha?{' '}
          <Link
            href="/login"
            className="font-medium transition-colors"
            style={{ color: '#FF6A2B' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FF8C42')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#FF6A2B')}
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}

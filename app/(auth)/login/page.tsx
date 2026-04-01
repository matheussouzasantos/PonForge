'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/dashboard')
  }

  async function handleGoogleLogin() {
    setError(null)
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/dashboard` },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#0B0B0C' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 flex flex-col gap-6"
        style={{
          background: '#1A1A1D',
          border: '1px solid #121214',
        }}
      >
        {/* Logo / Brand */}
        <div className="flex flex-col gap-1">
          <span
            className="text-2xl font-semibold tracking-tight"
            style={{ color: '#F5E6D3' }}
          >
            PonForge
          </span>
          <p className="text-sm" style={{ color: '#A1A1AA' }}>
            Entre na sua conta para continuar
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

        {/* Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: '#121214',
                border: '1px solid #2a2a2d',
                color: '#F5E6D3',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6A2B')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2d')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg px-4 py-3 text-sm outline-none transition-all"
              style={{
                background: '#121214',
                border: '1px solid #2a2a2d',
                color: '#F5E6D3',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#FF6A2B')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#2a2a2d')}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleLogin()}
            />
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleLogin}
          disabled={loading || googleLoading}
          className="w-full rounded-lg py-3 text-sm font-semibold transition-all disabled:opacity-50"
          style={{
            background: loading ? '#FF7A3D' : '#FF6A2B',
            color: '#0B0B0C',
          }}
          onMouseEnter={(e) => {
            if (!loading && !googleLoading)
              e.currentTarget.style.background = '#FF7A3D'
          }}
          onMouseLeave={(e) => {
            if (!loading)
              e.currentTarget.style.background = '#FF6A2B'
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: '#2a2a2d' }} />
          <span className="text-xs" style={{ color: '#A1A1AA' }}>
            ou
          </span>
          <div className="flex-1 h-px" style={{ background: '#2a2a2d' }} />
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="w-full rounded-lg py-3 text-sm font-medium flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
          style={{
            background: 'transparent',
            border: '1px solid #2a2a2d',
            color: '#F5E6D3',
          }}
          onMouseEnter={(e) => {
            if (!loading && !googleLoading)
              e.currentTarget.style.borderColor = '#FF6A2B'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2a2a2d'
          }}
        >
          <GoogleIcon />
          {googleLoading ? 'Redirecionando...' : 'Entrar com Google'}
        </button>

        {/* Sign up link */}
        <p className="text-center text-sm" style={{ color: '#A1A1AA' }}>
          Não tem conta?{' '}
          <Link
            href="/signup"
            className="font-medium transition-colors"
            style={{ color: '#FF6A2B' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FF8C42')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#FF6A2B')}
          >
            Criar conta
          </Link>
        </p>
        <p className="text-center text-sm" style={{ color: '#A1A1AA' }}>
          Esqueceu sua senha?{' '}
          <Link
            href="/forgot-password"
            className="font-medium transition-colors"
            style={{ color: '#FF6A2B' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FF8C42')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#FF6A2B')}
          >
            Recuperar
          </Link>
        </p>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  )
}

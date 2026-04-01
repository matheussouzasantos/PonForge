'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Settings, LogOut, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Plan = 'trial' | 'starter' | 'pro' | 'agency'

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  plan: Plan | null
}

const PLAN_BADGE: Record<Plan, { label: string; color: string; bg: string }> = {
  trial:   { label: 'Trial',   color: '#A1A1AA', bg: 'rgba(161,161,170,0.12)' },
  starter: { label: 'Starter', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)'  },
  pro:     { label: 'Pro',     color: '#A78BFA', bg: 'rgba(167,139,250,0.12)' },
  agency:  { label: 'Agency',  color: '#FBBF24', bg: 'rgba(251,191,36,0.12)'  },
}

function PlanBadge({ plan }: { plan: Plan | null }) {
  const config = PLAN_BADGE[plan ?? 'trial']
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  )
}

function Avatar({
  profile,
  size = 32,
}: {
  profile: Profile | null
  size?: number
}) {
  const name = profile?.full_name ?? profile?.email ?? 'U'
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  if (profile?.avatar_url) {
    return (
      <Image
        src={profile.avatar_url}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
      style={{
        width: size,
        height: size,
        background: 'rgba(255, 106, 43, 0.15)',
        color: '#FF6A2B',
      }}
    >
      {initials}
    </div>
  )
}

export function UserMenu() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, plan')
        .eq('id', user.id)
        .single()

      setProfile(data ?? { id: user.id, full_name: null, email: user.email ?? null, avatar_url: null, plan: null })
    }
    load()
  }, [])

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const displayName = profile?.full_name ?? profile?.email?.split('@')[0] ?? 'Usuário'

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all"
        style={{ color: '#F5E6D3' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <Avatar profile={profile} size={30} />
        <div className="flex flex-col items-start leading-tight">
          <span className="text-sm font-medium" style={{ color: '#F5E6D3' }}>
            {displayName}
          </span>
          {profile?.email && (
            <span className="text-xs" style={{ color: '#A1A1AA' }}>
              {profile.email}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          strokeWidth={2}
          style={{
            color: '#A1A1AA',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 150ms ease',
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-60 rounded-xl py-1 z-50"
          style={{
            background: '#1A1A1D',
            border: '1px solid #2a2a2d',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header — não clicável */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: '1px solid #2a2a2d' }}
          >
            <Avatar profile={profile} size={36} />
            <div className="flex flex-col gap-1 min-w-0">
              <span
                className="text-sm font-medium truncate"
                style={{ color: '#F5E6D3' }}
              >
                {displayName}
              </span>
              {profile?.email && (
                <span
                  className="text-xs truncate"
                  style={{ color: '#A1A1AA' }}
                >
                  {profile.email}
                </span>
              )}
              <PlanBadge plan={profile?.plan ?? 'trial'} />
            </div>
          </div>

          {/* Items */}
          <div className="p-1">
            <Link
              href="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all"
              style={{ color: '#A1A1AA' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.color = '#F5E6D3'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#A1A1AA'
              }}
            >
              <Settings size={15} />
              Configurações
            </Link>
          </div>

          {/* Separador */}
          <div className="mx-3 my-1" style={{ height: '1px', background: '#2a2a2d' }} />

          {/* Sair */}
          <div className="p-1">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all"
              style={{ color: '#A1A1AA' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 106, 43, 0.08)'
                e.currentTarget.style.color = '#FF6A2B'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#A1A1AA'
              }}
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

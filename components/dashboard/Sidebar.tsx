'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/projects', label: 'Projetos', icon: FolderKanban },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-30"
      style={{
        background: '#1A1A1D',
        borderRight: '1px solid #121214',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 h-16 shrink-0"
        style={{ borderBottom: '1px solid #121214' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: '#FF6A2B' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 12L7 2l5 10H2z"
              fill="#0B0B0C"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          className="text-base font-semibold tracking-tight"
          style={{ color: '#F5E6D3' }}
        >
          PonForge
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact)
          return (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(255, 106, 43, 0.12)' : 'transparent',
                color: active ? '#FF6A2B' : '#A1A1AA',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.color = '#F5E6D3'
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#A1A1AA'
                }
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              <span className="flex-1">{label}</span>
              {active && (
                <ChevronRight size={14} strokeWidth={2.5} style={{ color: '#FF6A2B' }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 shrink-0" style={{ borderTop: '1px solid #121214' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
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
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}

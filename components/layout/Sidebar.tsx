'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderOpen,
  LayoutTemplate,
  Palette,
  Settings,
} from 'lucide-react'

const NAV_MAIN = [
  { href: '/dashboard',           label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { href: '/dashboard/projects',  label: 'Projetos',   icon: FolderOpen },
  { href: '/dashboard/templates', label: 'Templates',  icon: LayoutTemplate },
]

const NAV_BOTTOM = [
  { href: '/dashboard/brand',    label: 'Brand Kit',      icon: Palette },
  { href: '/dashboard/settings', label: 'Configurações',  icon: Settings },
]

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
}: {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
}) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
      style={{
        background: active ? 'rgba(255, 106, 43, 0.1)' : 'transparent',
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
      <Icon
        size={16}
        strokeWidth={active ? 2.5 : 2}
        style={{ shrink: 0 }}
      />
      <span>{label}</span>
      {active && (
        <span
          className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: '#FF6A2B' }}
        />
      )}
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 flex flex-col"
      style={{
        width: 240,
        height: '100vh',
        background: '#1A1A1D',
        borderRight: '1px solid #121214',
        zIndex: 30,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-5 shrink-0"
        style={{
          height: 64,
          borderBottom: '1px solid #121214',
        }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: '#FF6A2B' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 12L7 2l5 10H2z" fill="#0B0B0C" strokeLinejoin="round" />
          </svg>
        </div>
        <span
          className="text-base font-semibold tracking-tight"
          style={{ color: '#F5E6D3' }}
        >
          PonForge
        </span>
      </div>

      {/* Nav principal */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1 overflow-y-auto">
        {NAV_MAIN.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Separador + Nav inferior */}
      <div
        className="p-3 shrink-0 flex flex-col gap-0.5"
        style={{ borderTop: '1px solid #121214' }}
      >
        {NAV_BOTTOM.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
    </aside>
  )
}

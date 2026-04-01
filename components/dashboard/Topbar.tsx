'use client'

import { Bell } from 'lucide-react'
import { UserMenu } from '@/components/ui/UserMenu'

export function Topbar() {
  return (
    <header
      className="fixed top-0 right-0 h-16 flex items-center justify-between px-6 z-20"
      style={{
        left: '240px',
        background: '#0B0B0C',
        borderBottom: '1px solid #121214',
      }}
    >
      {/* Left — espaço para breadcrumb futuro */}
      <div />

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-lg transition-all"
          style={{ color: '#A1A1AA' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.color = '#F5E6D3'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#A1A1AA'
          }}
        >
          <Bell size={17} />
        </button>

        {/* Divider */}
        <div className="w-px h-5" style={{ background: '#2a2a2d' }} />

        <UserMenu />
      </div>
    </header>
  )
}

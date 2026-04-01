import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#0B0B0C' }}>
      <Sidebar />
      <Topbar />
      <main
        className="pt-16 min-h-screen"
        style={{ marginLeft: 240 }}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

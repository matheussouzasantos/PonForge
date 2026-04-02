export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0B0B0C',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}

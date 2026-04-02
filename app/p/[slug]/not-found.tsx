export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0B0B0C',
        color: '#A1A1AA',
        fontFamily: 'inherit',
        gap: 12,
      }}
    >
      <span style={{ fontSize: 48, lineHeight: 1 }}>404</span>
      <p style={{ margin: 0, fontSize: 16, color: '#71717A' }}>
        Esta página não existe ou não está publicada.
      </p>
    </div>
  )
}

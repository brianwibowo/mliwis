import { Waves } from 'lucide-react'

export default function Loading() {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh', 
        gap: 16,
        padding: 24,
        textAlign: 'center'
      }}
    >
      <div 
        style={{ 
          position: 'relative', 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="spinner spinner-lg" style={{ width: 64, height: 64, borderWidth: 4 }} />
        <Waves 
          size={24} 
          style={{ 
            position: 'absolute', 
            color: 'var(--color-primary-600)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }} 
        />
      </div>
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-950)', margin: '0 0 4px' }}>
          Pantai Mliwis
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
          Memuat halaman...
        </p>
      </div>
    </div>
  )
}

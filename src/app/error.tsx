'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Public Page Error Boundary]:', error)
  }, [error])

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '40px 24px',
          borderRadius: '24px',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
          Terjadi Kendala Teknis
        </h2>
        
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '28px' }}>
          Halaman tidak dapat dimuat secara sempurna saat ini. Jangan khawatir, data Anda aman. Silakan coba muat ulang halaman.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <RefreshCw size={16} /> Coba Lagi
          </button>
          
          <Link
            href="/"
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <Home size={16} /> Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}

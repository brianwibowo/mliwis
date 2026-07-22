'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw, LayoutDashboard } from 'lucide-react'

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin Error Boundary]:', error)
  }, [error])

  return (
    <div style={{ maxWidth: '600px', margin: '60px auto', padding: '0 16px' }}>
      <div
        className="card"
        style={{
          borderRadius: '20px',
          border: '1px solid var(--color-border-subtle)',
          padding: '36px 24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <AlertCircle size={28} />
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
          Gagal Memuat Data Pengelola
        </h2>
        
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '24px' }}>
          Terjadi hambatan komunikasi dengan server saat memuat modul ini. Silakan coba muat ulang atau kembali ke dashboard utama.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
          >
            <RefreshCw size={15} /> Muat Ulang Halaman
          </button>
          
          <Link
            href="/dashboard"
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
          >
            <LayoutDashboard size={15} /> Ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

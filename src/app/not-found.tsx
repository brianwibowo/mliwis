import Link from 'next'
import LinkComponent from 'next/link'
import { FileQuestion, ArrowLeft, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          padding: '40px 24px',
          borderRadius: '24px',
          border: '1px solid var(--color-border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(14, 116, 144, 0.1)',
            color: 'var(--color-primary-600)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <FileQuestion size={32} />
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-900)', marginBottom: '8px' }}>
          Halaman Tidak Ditemukan (404)
        </h2>
        
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '28px' }}>
          Maaf, halaman yang Anda cari tidak tersedia, telah dipindahkan, atau alamat URL salah.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <LinkComponent
            href="/"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <Home size={16} /> Kembali ke Beranda
          </LinkComponent>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Search, CalendarCheck, CheckCircle, XCircle, Clock, Waves } from 'lucide-react'
import { checkBookingStatus } from '../actions'
import { formatTanggal } from '@/lib/format'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'

interface BookingResult {
  kodeBooking: string; namaCustomer: string; nomorHP: string; jenisAcara: string; status: string
  tanggalMulai: string; tanggalSelesai: string; catatanPengelola: string | null; fasilitas: string[]
}

const statusConfig = {
  menunggu: { icon: <Clock size={48} />, color: 'var(--color-warning)', label: 'Menunggu Validasi', desc: 'Booking Anda sedang menunggu persetujuan pengelola.' },
  disetujui: { icon: <CheckCircle size={48} />, color: 'var(--color-success)', label: 'Disetujui', desc: 'Booking Anda telah disetujui! Silakan datang sesuai jadwal.' },
  ditolak: { icon: <XCircle size={48} />, color: 'var(--color-danger)', label: 'Ditolak', desc: 'Maaf, booking Anda ditolak. Lihat catatan pengelola di bawah.' },
}

export default function BookingStatusPage() {
  const [isPending, startTransition] = useTransition()
  const [kode, setKode] = useState('')
  const [result, setResult] = useState<BookingResult | null>(null)
  const [error, setError] = useState('')

  const handleCheck = () => {
    setError(''); setResult(null)
    startTransition(async () => {
      const r = await checkBookingStatus(kode.trim().toUpperCase())
      if (r.error) setError(r.error)
      else if (r.data) setResult(r.data)
    })
  }

  const cfg = result ? statusConfig[result.status as keyof typeof statusConfig] : null

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <PublicHeader transparentByDefault={true} />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '360px',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.65)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          padding: '0 24px',
        }}
      >
        <div style={{ maxWidth: '800px', marginTop: '60px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <CalendarCheck size={14} />
            <span>Verifikasi Sewa</span>
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
            Cek Status Booking
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginTop: '12px', lineHeight: '1.5' }}>
            Masukkan kode booking unik Anda untuk melacak proses persetujuan oleh pengelola.
          </p>
        </div>
      </section>

      {/* Check Status Container */}
      <div style={{ padding: '80px 24px', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="booking-status-container" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div className="card mb-4" style={{ animation: 'slideUp 0.4s ease-out', border: '1px solid var(--color-border-subtle)', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-body" style={{ padding: 32 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 12, display: 'block', color: 'var(--color-primary-900)' }}>
                Masukkan Kode Booking Anda
              </label>
              <div className="flex gap-3">
                <input
                  className="form-input"
                  placeholder="Contoh: BK-A1B2C3D4"
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', letterSpacing: '0.05em', borderRadius: '12px' }}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleCheck}
                  disabled={isPending || !kode.trim()}
                  style={{ borderRadius: '12px', padding: '0 24px' }}
                >
                  {isPending ? <span className="spinner spinner-sm spinner-white" /> : <><Search size={18} /> Cek</>}
                </button>
              </div>
              {error && <div className="alert alert-danger mt-4" style={{ borderRadius: '12px' }}>{error}</div>}
            </div>
          </div>
          
          <div className="text-center mb-6">
            <Link href="/booking" style={{ color: 'var(--color-primary-600)', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
              ← Buat booking baru
            </Link>
          </div>

          {result && cfg && (
            <div className="card" style={{ animation: 'slideUp 0.4s ease-out', border: '1px solid var(--color-border-subtle)', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
              <div className="card-body" style={{ padding: 32 }}>
                <div className="text-center mb-6">
                  <div style={{ color: cfg.color, marginBottom: 12 }}>{cfg.icon}</div>
                  <h2 style={{ color: cfg.color, fontSize: '1.5rem', fontWeight: 700 }}>{cfg.label}</h2>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>{cfg.desc}</p>
                </div>
                <div style={{ background: 'var(--color-surface-alt)', borderRadius: '16px', padding: 24, border: '1px solid var(--color-border)' }}>
                  <div className="grid-2 gap-4">
                    <div>
                      <p className="text-xs text-muted" style={{ margin: 0 }}>Kode Booking</p>
                      <p className="font-bold font-mono" style={{ margin: '4px 0 0', fontSize: '1.1rem' }}>{result.kodeBooking}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted" style={{ margin: 0 }}>Status</p>
                      <span className={`badge badge-${result.status}`} style={{ marginTop: '4px' }}>{result.status}</span>
                    </div>
                    <div>
                      <p className="text-xs text-muted" style={{ margin: 0 }}>Nama Customer</p>
                      <p className="font-semibold" style={{ margin: '4px 0 0' }}>{result.namaCustomer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted" style={{ margin: 0 }}>No WhatsApp</p>
                      <p style={{ margin: '4px 0 0' }}>{result.nomorHP}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted" style={{ margin: 0 }}>Tanggal Pelaksanaan</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>{formatTanggal(result.tanggalMulai)}{result.tanggalMulai !== result.tanggalSelesai && ` — ${formatTanggal(result.tanggalSelesai)}`}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted" style={{ margin: 0 }}>Jenis Acara</p>
                      <p style={{ margin: '4px 0 0' }}>{result.jenisAcara}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-muted mb-2" style={{ margin: '16px 0 8px' }}>Fasilitas Sewa</p>
                    <div className="flex flex-wrap gap-2">
                      {result.fasilitas.map((f) => (
                        <span key={f} className="badge badge-info">{f}</span>
                      ))}
                    </div>
                  </div>
                  {result.catatanPengelola && (
                    <div className="mt-4" style={{ padding: '12px 16px', background: 'white', borderRadius: '12px', border: '1px solid var(--color-border)', marginTop: '20px' }}>
                      <p className="text-xs text-muted mb-1" style={{ margin: 0 }}>Catatan Pengelola</p>
                      <p className="text-sm" style={{ margin: '4px 0 0', lineHeight: 1.4 }}>{result.catatanPengelola}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}

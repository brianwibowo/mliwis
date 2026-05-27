'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Waves, Search, CalendarCheck, Phone, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'
import { checkBookingStatus } from '../actions'
import { formatTanggal } from '@/lib/format'

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
    <div style={{ background: 'var(--color-surface-alt)', minHeight: '100vh' }}>
      <header style={{ height: '60px', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: 'var(--color-primary-900)', textDecoration: 'none' }}>
          <ArrowLeft size={16} className="text-primary" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      <div className="booking-hero">
        <Waves size={48} style={{ marginBottom: 16, opacity: 0.8 }} />
        <h1>Cek Status Booking</h1>
        <p>Masukkan kode booking untuk melihat status</p>
      </div>
      <div className="booking-status-container">
        <div className="card mb-4" style={{ animation: 'slideUp 0.4s ease-out', border: '1px solid var(--color-border)' }}>
          <div className="card-body" style={{ padding: 32 }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 12, display: 'block', color: 'var(--color-primary-900)' }}>
              Input/Tambahkan Kode Booking Anda
            </label>
            <div className="flex gap-3">
              <input className="form-input" placeholder="Contoh: BK-A1B2C3D4" value={kode} onChange={(e) => setKode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCheck()} style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', letterSpacing: '0.05em' }} />
              <button className="btn btn-primary" onClick={handleCheck} disabled={isPending || !kode.trim()}>{isPending ? <span className="spinner spinner-sm spinner-white" /> : <><Search size={18} /> Cek</>}</button>
            </div>
            {error && <div className="alert alert-danger mt-4">{error}</div>}
          </div>
        </div>
        <div className="text-center mb-6">
          <Link href="/booking" className="text-primary text-sm font-semibold" style={{ textDecoration: 'none' }}>
            ← Buat booking baru
          </Link>
        </div>
        {result && cfg && (
          <div className="card" style={{ animation: 'slideUp 0.4s ease-out', border: '1px solid var(--color-border)' }}>
            <div className="card-body" style={{ padding: 32 }}>
              <div className="text-center mb-6">
                <div style={{ color: cfg.color, marginBottom: 12 }}>{cfg.icon}</div>
                <h2 style={{ color: cfg.color }}>{cfg.label}</h2>
                <p className="text-muted">{cfg.desc}</p>
              </div>
              <div style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-xl)', padding: 24, border: '1px solid var(--color-border)' }}>
                <div className="grid-2 gap-4">
                  <div><p className="text-xs text-muted">Kode Booking</p><p className="font-bold font-mono">{result.kodeBooking}</p></div>
                  <div><p className="text-xs text-muted">Status</p><span className={`badge badge-${result.status}`}>{result.status}</span></div>
                  <div><p className="text-xs text-muted">Nama</p><p className="font-semibold">{result.namaCustomer}</p></div>
                  <div><p className="text-xs text-muted">No HP</p><p>{result.nomorHP}</p></div>
                  <div><p className="text-xs text-muted">Tanggal</p><p>{formatTanggal(result.tanggalMulai)}{result.tanggalMulai !== result.tanggalSelesai && ` — ${formatTanggal(result.tanggalSelesai)}`}</p></div>
                  <div><p className="text-xs text-muted">Jenis Acara</p><p>{result.jenisAcara}</p></div>
                </div>
                <div className="mt-4"><p className="text-xs text-muted mb-2">Fasilitas</p><div className="flex flex-wrap gap-2">{result.fasilitas.map((f) => <span key={f} className="badge badge-info">{f}</span>)}</div></div>
                {result.catatanPengelola && <div className="mt-4" style={{ padding: '12px 16px', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}><p className="text-xs text-muted mb-1">Catatan Pengelola</p><p className="text-sm">{result.catatanPengelola}</p></div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

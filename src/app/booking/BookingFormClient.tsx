'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Waves, Send, Copy, CheckCircle, Tent, TreePine, Building, Camera, Store, ArrowLeft, Info, Calendar, MapPin, Phone, ShieldCheck, ChevronRight } from 'lucide-react'
import { createBooking } from './actions'

const facilityIcons: Record<string, React.ReactNode> = {
  'Area Camping Ground': <Tent size={20} />,
  'Area Outbound': <TreePine size={20} />,
  'Pendopo/Aula Terbuka': <Building size={20} />,
  'Area Prewedding': <Camera size={20} />,
  'Area UMKM': <Store size={20} />,
}

interface Fasilitas { id: number; nama: string; deskripsi: string | null }

export default function BookingFormClient({ fasilitas }: { fasilitas: Fasilitas[] }) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ kodeBooking: string } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = (formData: FormData) => {
    setError('')
    startTransition(async () => {
      const r = await createBooking(formData)
      if (r.error) setError(r.error)
      else if (r.kodeBooking) setResult({ kodeBooking: r.kodeBooking })
    })
  }

  const copyCode = () => {
    if (result) {
      navigator.clipboard.writeText(result.kodeBooking)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (result) {
    return (
      <div>
        <div className="booking-hero">
          <Waves size={48} style={{ marginBottom: 16, opacity: 0.8 }} />
          <h1>Booking Berhasil!</h1>
          <p>Simpan kode booking Anda untuk mengecek status</p>
        </div>
        <div className="booking-container">
          <div className="card booking-status-card" style={{ animation: 'bounceIn 0.5s ease-out' }}>
            <div className="card-body" style={{ textAlign: 'center', padding: '48px 32px' }}>
              <CheckCircle size={64} style={{ color: 'var(--color-success)', margin: '0 auto 16px' }} />
              <p className="text-muted mb-2">Kode Booking Anda</p>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary-600)', letterSpacing: '0.05em', marginBottom: 16 }}>{result.kodeBooking}</div>
              <button className="btn btn-outline mb-4" onClick={copyCode}><Copy size={16} /> {copied ? 'Tersalin!' : 'Salin Kode'}</button>
              <p className="text-muted text-sm">Pengelola akan memvalidasi booking Anda. Cek status dengan kode di atas.</p>
              <div className="flex-center gap-3 mt-6">
                <Link href="/booking/status" className="btn btn-primary">Cek Status Booking</Link>
                <Link href="/booking" className="btn btn-ghost">Booking Lagi</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--color-surface-alt)', minHeight: '100vh' }}>
      {/* Top mini-bar */}
      <header style={{ height: '60px', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, color: 'var(--color-primary-900)', textDecoration: 'none' }}>
          <ArrowLeft size={16} className="text-primary" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link href="/booking/status" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-primary-600)', textDecoration: 'none' }}>
          <span>Cek Status Booking</span>
          <ChevronRight size={14} />
        </Link>
      </header>

      {/* Hero Header with blurred image background */}
      <div className="booking-hero">
        <Waves size={40} style={{ marginBottom: 16, opacity: 0.9 }} />
        <h1>Booking Acara Pantai Mliwis</h1>
        <p>Reservasi area pariwisata terpadu Pantai Mliwis secara online dan instan</p>
      </div>

      {/* Two column grid container */}
      <div className="booking-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {/* Left Column: Sticky Guide info */}
        <aside className="booking-info-panel" id="booking-guide-panel">
          <h4 style={{ color: 'var(--color-primary-900)', borderBottom: '2px solid var(--color-border-light)', paddingBottom: 12, marginBottom: 16 }}>Panduan Pemesanan</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>1</span>
              <div>
                <h5 style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Lengkapi Kredensial</h5>
                <p className="text-muted text-xs">Masukkan nama lengkap penanggung jawab dan nomor WhatsApp yang aktif.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>2</span>
              <div>
                <h5 style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Pilih Tanggal Acara</h5>
                <p className="text-muted text-xs">Pilih rentang tanggal pelaksanaan. Silakan periksa ketersediaan jadwal terlebih dahulu.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>3</span>
              <div>
                <h5 style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Tentukan Fasilitas</h5>
                <p className="text-muted text-xs">Centang satu atau beberapa fasilitas area yang ingin Anda sewa secara bersamaan.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>4</span>
              <div>
                <h5 style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Dapatkan Kode Unik</h5>
                <p className="text-muted text-xs">Simpan kode booking setelah pemesanan untuk melacak status persetujuan admin.</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, padding: 16, background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h5 style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 12, color: 'var(--color-primary-800)', marginBottom: 8 }}>
              <Info size={14} />
              <span>Butuh Bantuan?</span>
            </h5>
            <p className="text-muted text-xs" style={{ lineHeight: 1.5, marginBottom: 12 }}>Hubungi pengelola Pantai Mliwis untuk koordinasi khusus atau pertanyaan harga sewa.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--color-text)' }}>
                <Phone size={12} className="text-primary" />
                <span>+62 823-4567-8901</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--color-text)' }}>
                <MapPin size={12} className="text-primary" />
                <span>Ambal, Kebumen, Jawa Tengah</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Column: Booking Form Card */}
        <main className="booking-form-panel">
          <div className="card" style={{ animation: 'slideUp 0.4s ease-out', border: '1px solid var(--color-border)' }}>
            <div className="card-body" style={{ padding: 'var(--space-6) var(--space-8)' }}>
              <h3 className="mb-6" style={{ color: 'var(--color-primary-900)', borderBottom: '2px solid var(--color-border-light)', paddingBottom: 12 }}>Formulir Booking Area</h3>
              
              {error && <div className="alert alert-danger mb-4">{error}</div>}
              
              <form action={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap / Instansi <span className="required">*</span></label>
                    <input name="namaCustomer" className="form-input" placeholder="Nama lengkap penanggung jawab" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nomor WhatsApp Aktif <span className="required">*</span></label>
                    <input name="nomorHP" className="form-input" placeholder="Contoh: 0823xxxxxxxx" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tanggal Mulai Acara <span className="required">*</span></label>
                    <input name="tanggalMulai" type="date" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Selesai Acara <span className="required">*</span></label>
                    <input name="tanggalSelesai" type="date" className="form-input" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Jenis / Deskripsi Acara <span className="required">*</span></label>
                  <input name="jenisAcara" className="form-input" placeholder="Contoh: Makrab Mahasiswa, Outbound Karyawan, Prewedding Wisata" required />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: 12 }}>Pilih Fasilitas Area Wisata <span className="required">*</span></label>
                  <div className="facility-checkbox-grid">
                    {fasilitas.map((f) => (
                      <label key={f.id} className="facility-checkbox">
                        <input type="checkbox" name="fasilitas" value={f.id} />
                        <span className="facility-checkbox-label">
                          <span className="facility-checkbox-icon">{facilityIcons[f.nama] || <Tent size={20} />}</span>
                          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                            <span className="facility-checkbox-text" style={{ display: 'block', lineHeight: 1.2 }}>{f.nama}</span>
                            {f.deskripsi && <span className="facility-checkbox-desc" style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.3 }}>{f.deskripsi}</span>}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-full" style={{ marginTop: 'var(--space-4)', padding: '14px' }} disabled={isPending}>
                  {isPending ? (
                    <><span className="spinner spinner-sm spinner-white" /> Mengirim...</>
                  ) : (
                    <><Send size={18} /> Ajukan Sewa Area</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
      
      <div className="text-center mt-6" style={{ paddingBottom: 40 }}>
        <Link href="/booking/status" className="text-primary text-sm font-semibold" style={{ textDecoration: 'none' }}>
          Sudah memiliki kode booking? Cek status di sini →
        </Link>
      </div>
    </div>
  )
}

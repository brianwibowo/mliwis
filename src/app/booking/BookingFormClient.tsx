'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Waves, Send, Copy, CheckCircle, Tent, TreePine, Building, Camera, Store } from 'lucide-react'
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
    <div>
      <div className="booking-hero">
        <Waves size={48} style={{ marginBottom: 16, opacity: 0.8 }} />
        <h1>Booking Acara Pantai Mliwis</h1>
        <p>Reservasi tempat untuk acara Anda di Pantai Mliwis, Kebumen</p>
      </div>
      <div className="booking-container">
        <div className="card" style={{ animation: 'slideUp 0.4s ease-out' }}>
          <div className="card-body" style={{ padding: 32 }}>
            <h3 className="mb-6">Form Booking</h3>
            {error && <div className="alert alert-danger mb-4">{error}</div>}
            <form action={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Nama Lengkap <span className="required">*</span></label><input name="namaCustomer" className="form-input" placeholder="Nama lengkap / organisasi" required /></div>
                <div className="form-group"><label className="form-label">Nomor HP <span className="required">*</span></label><input name="nomorHP" className="form-input" placeholder="08xxxxxxxxxx" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Tanggal Mulai <span className="required">*</span></label><input name="tanggalMulai" type="date" className="form-input" required /></div>
                <div className="form-group"><label className="form-label">Tanggal Selesai <span className="required">*</span></label><input name="tanggalSelesai" type="date" className="form-input" required /></div>
              </div>
              <div className="form-group"><label className="form-label">Jenis Acara <span className="required">*</span></label><input name="jenisAcara" className="form-input" placeholder="Contoh: Camping Keluarga, Outbound, Prewedding" required /></div>
              <div className="form-group">
                <label className="form-label">Pilih Fasilitas <span className="required">*</span></label>
                <div className="facility-checkbox-grid">
                  {fasilitas.map((f) => (
                    <label key={f.id} className="facility-checkbox">
                      <input type="checkbox" name="fasilitas" value={f.id} />
                      <span className="facility-checkbox-label">
                        <span className="facility-checkbox-icon">{facilityIcons[f.nama] || <Tent size={20} />}</span>
                        <span><span className="facility-checkbox-text">{f.nama}</span>{f.deskripsi && <span className="facility-checkbox-desc">{f.deskripsi}</span>}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isPending}>{isPending ? <><span className="spinner spinner-sm spinner-white" /> Mengirim...</> : <><Send size={18} /> Kirim Booking</>}</button>
            </form>
          </div>
        </div>
        <div className="text-center mt-4"><Link href="/booking/status" className="text-primary text-sm">Sudah punya kode booking? Cek status →</Link></div>
      </div>
    </div>
  )
}

'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Waves, Send, Copy, CheckCircle, Tent, TreePine, Building, Camera, Store, Info, Phone, MapPin, ExternalLink, Umbrella, Grid, Smile, Droplet, Zap, Compass } from 'lucide-react'
import { createBooking } from '../actions'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import BookingCalendar from '@/components/booking/BookingCalendar'

const facilityIcons: Record<string, React.ReactNode> = {
  'Area Camping Ground': <Tent size={20} />,
  'Sewa Payung Pantai': <Umbrella size={20} />,
  'Mushola Pantai': <Building size={20} />,
  'Area UMKM': <Store size={20} />,
  'Pendopo/Aula Terbuka': <Building size={20} />,
  'Sewa Tikar Piknik': <Grid size={20} />,
  'Sewa Kuda Pantai': <Compass size={20} />,
  'Gazebo Pantai': <Building size={20} />,
  'Area Ayunan': <Smile size={20} />,
  'Kolam Renang Anak': <Droplet size={20} />,
  'Sewa ATV Pantai': <Zap size={20} />,
  'Area Outbound': <TreePine size={20} />,
  'Area Prewedding': <Camera size={20} />,
}

const slugMap: Record<string, string> = {
  'camping-ground': 'Area Camping Ground',
  'payung-pantai': 'Sewa Payung Pantai',
  'musola': 'Mushola Pantai',
  'aneka-kuliner': 'Area UMKM',
  'pendopo': 'Pendopo/Aula Terbuka',
  'sewa-tikar': 'Sewa Tikar Piknik',
  'kuda-pantai': 'Sewa Kuda Pantai',
  'gazebo': 'Gazebo Pantai',
  'sewa-ayunan': 'Area Ayunan',
  'kolam-renang-anak': 'Kolam Renang Anak',
  'atv-pantai': 'Sewa ATV Pantai',
  'pohon-cemara': 'Area Camping Ground',
}

// Map facility name to slug for the preview link
const facilitySlugMap: Record<string, string> = {
  'Area Camping Ground': 'camping-ground',
  'Sewa Payung Pantai': 'payung-pantai',
  'Mushola Pantai': 'musola',
  'Area UMKM': 'aneka-kuliner',
  'Pendopo/Aula Terbuka': 'pendopo',
  'Sewa Tikar Piknik': 'sewa-tikar',
  'Sewa Kuda Pantai': 'kuda-pantai',
  'Gazebo Pantai': 'gazebo',
  'Area Ayunan': 'sewa-ayunan',
  'Kolam Renang Anak': 'kolam-renang-anak',
  'Sewa ATV Pantai': 'atv-pantai',
  'Area Outbound': 'kuda-pantai',
  'Area Prewedding': 'pendopo',
}

interface Fasilitas { id: number; nama: string; deskripsi: string | null }

export default function BookingFormPage({ fasilitas }: { fasilitas: Fasilitas[] }) {
  const searchParams = useSearchParams()
  const preselectedFasilitasSlug = searchParams ? searchParams.get('fasilitas') : null

  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ kodeBooking: string } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Automatically check the pre-selected facility based on query param
  useEffect(() => {
    if (preselectedFasilitasSlug && fasilitas.length > 0) {
      const targetName = slugMap[preselectedFasilitasSlug]
      const found = fasilitas.find(f => f.nama === targetName)
      if (found) {
        setSelectedIds([found.id])
      }
    }
  }, [preselectedFasilitasSlug, fasilitas])

  const handleCheckboxChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = (formData: FormData) => {
    setError('')
    // Ensure all checked facilities are added to form data
    formData.delete('fasilitas')
    selectedIds.forEach(id => formData.append('fasilitas', String(id)))

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
      <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
        <PublicHeader transparentByDefault={false} />
        
        <div style={{ padding: '140px 24px 80px' }}>
          <div className="booking-container">
            <div className="card booking-status-card" style={{ animation: 'bounceIn 0.5s ease-out', maxWidth: '600px', margin: '0 auto', border: '1px solid var(--color-border)' }}>
              <div className="card-body" style={{ textAlign: 'center', padding: '48px 32px' }}>
                <CheckCircle size={64} style={{ color: 'var(--color-success)', margin: '0 auto 16px' }} />
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-950)', marginBottom: '8px' }}>Booking Berhasil!</h1>
                <p className="text-muted mb-6">Simpan kode booking Anda untuk mengecek status</p>
                
                <p className="text-muted mb-2 text-sm">Kode Booking Anda</p>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary-600)', letterSpacing: '0.05em', marginBottom: 16 }}>{result.kodeBooking}</div>
                
                <button className="btn btn-outline mb-6" onClick={copyCode} style={{ margin: '0 auto' }}><Copy size={16} /> {copied ? 'Tersalin!' : 'Salin Kode'}</button>
                <p className="text-muted text-sm" style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px' }}>
                  Pengelola akan memvalidasi booking Anda. Cek status secara berkala dengan kode di atas.
                </p>
                <div className="flex-center gap-3 mt-6" style={{ justifyContent: 'center' }}>
                  <Link href="/booking/status" className="btn btn-primary">Cek Status Booking</Link>
                  <button className="btn btn-ghost" onClick={() => { setResult(null); setSelectedIds([]) }}>Booking Lagi</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PublicFooter />
      </div>
    )
  }

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
            <Waves size={14} />
            <span>Formulir Reservasi</span>
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
            Formulir Booking Tempat
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginTop: '12px', lineHeight: '1.5' }}>
            Lengkapi data di bawah ini untuk mengajukan sewa area Pantai Mliwis.
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section style={{ padding: '80px 0 20px', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--color-primary-950)', fontWeight: 700 }}>Jadwal Ketersediaan Tempat</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Silakan pilih tanggal yang kosong pada kalender di bawah ini sebelum mengisi formulir pengajuan sewa.</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-subtle)' }}>
            <BookingCalendar />
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: '40px 0 80px', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--color-primary-950)', fontWeight: 700 }}>Formulir Pengajuan Sewa</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Lengkapi formulir pengajuan sewa di bawah ini. Tim pengelola akan segera memproses pengajuan Anda.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>
            {/* Guidelines Card */}
            <aside style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ color: 'var(--color-primary-900)', borderBottom: '2px solid var(--color-border-light)', paddingBottom: 12, marginBottom: 16, fontSize: '1.1rem', fontWeight: 700 }}>Panduan Pemesanan</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

              <div style={{ marginTop: 28, padding: 20, background: 'var(--color-surface-alt)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
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

            {/* Form Card */}
            <main>
              <div className="card" style={{ border: '1px solid var(--color-border-subtle)', borderRadius: '24px', boxShadow: 'var(--shadow-sm)' }}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3 className="mb-6" style={{ color: 'var(--color-primary-900)', borderBottom: '2px solid var(--color-border-light)', paddingBottom: 12, fontSize: '1.25rem', fontWeight: 700 }}>Formulir Booking Area</h3>
                  
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
                      <textarea
                        name="jenisAcara"
                        className="form-input"
                        placeholder="Contoh: Makrab Mahasiswa, Outbound Karyawan, Prewedding Wisata. Jelaskan secara detail mengenai acara Anda."
                        required
                        rows={4}
                        style={{ resize: 'vertical', width: '100%' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ marginBottom: 4 }}>Pilih Fasilitas Area Wisata <span className="required">*</span></label>
                      <p className="text-muted text-xs" style={{ marginBottom: 12 }}>
                        Klik ikon <ExternalLink size={11} style={{ verticalAlign: 'middle' }} /> pada setiap fasilitas untuk melihat detail di tab baru.
                      </p>
                      <div className="facility-checkbox-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                        {fasilitas.map((f) => {
                          const slug = facilitySlugMap[f.nama]
                          return (
                            <div key={f.id} style={{ position: 'relative' }}>
                              <label
                                className="facility-checkbox"
                                style={{
                                  display: 'flex',
                                  padding: '12px',
                                  border: selectedIds.includes(f.id) ? '2px solid var(--color-primary-600)' : '2px solid var(--color-border-subtle)',
                                  borderRadius: '12px',
                                  cursor: 'pointer',
                                  backgroundColor: selectedIds.includes(f.id) ? 'var(--color-primary-50)' : 'transparent',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  name="fasilitas"
                                  value={f.id}
                                  checked={selectedIds.includes(f.id)}
                                  onChange={() => handleCheckboxChange(f.id)}
                                  style={{ marginRight: '8px' }}
                                />
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                  <span className="facility-checkbox-icon" style={{ color: 'var(--color-primary-600)' }}>
                                    {facilityIcons[f.nama] || <Tent size={20} />}
                                  </span>
                                  <span className="facility-checkbox-text" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary-950)' }}>
                                    {f.nama}
                                  </span>
                                </span>
                                {slug && (
                                  <a
                                    href={`/fasilitas/${slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                      color: 'var(--color-primary-500)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: '2px',
                                      flexShrink: 0,
                                    }}
                                    title={`Lihat detail ${f.nama}`}
                                  >
                                    <ExternalLink size={14} />
                                  </a>
                                )}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-full" style={{ marginTop: '24px', padding: '14px', borderRadius: '12px', justifyContent: 'center' }} disabled={isPending}>
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
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}

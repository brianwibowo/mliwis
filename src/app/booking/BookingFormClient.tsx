'use client'

import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Waves, Send, Copy, CheckCircle, Tent, TreePine, Building, Camera, Store, 
  Info, Phone, MapPin, ExternalLink, Umbrella, Grid, Smile, Droplet, Zap, 
  Compass, Search, Clock, XCircle, ArrowLeft, Calendar 
} from 'lucide-react'
import { createBooking, checkBookingStatus } from './actions'
import { formatTanggal } from '@/lib/format'
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

interface Fasilitas {
  id: number
  nama: string
  deskripsi: string | null
}

interface BookingResult {
  kodeBooking: string
  namaCustomer: string
  nomorHP: string
  jenisAcara: string
  status: string
  tanggalMulai: string
  tanggalSelesai: string
  catatanPengelola: string | null
  fasilitas: string[]
}

const statusConfig = {
  menunggu: { 
    icon: <Clock size={48} />, 
    color: '#fed43e', 
    bgColor: 'rgba(254, 212, 62, 0.1)', 
    textColor: '#856404',
    borderColor: 'rgba(254, 212, 62, 0.3)',
    label: 'Menunggu Validasi', 
    desc: 'Pengajuan sewa Anda telah diterima dan sedang menunggu peninjauan oleh pengelola Pantai Mliwis.' 
  },
  disetujui: { 
    icon: <CheckCircle size={48} />, 
    color: '#14a2ba', 
    bgColor: 'rgba(20, 162, 186, 0.1)', 
    textColor: '#0f2556',
    borderColor: 'rgba(20, 162, 186, 0.3)',
    label: 'Booking Disetujui', 
    desc: 'Selamat! Pengajuan booking Anda telah disetujui. Silakan datang ke lokasi sesuai tanggal jadwal.' 
  },
  ditolak: { 
    icon: <XCircle size={48} />, 
    color: '#e3342f', 
    bgColor: 'rgba(227, 52, 47, 0.1)', 
    textColor: '#721c24',
    borderColor: 'rgba(227, 52, 47, 0.3)',
    label: 'Booking Ditolak', 
    desc: 'Maaf, pengajuan booking Anda belum dapat disetujui. Periksa catatan pengelola di bawah untuk alasan penolakan.' 
  },
}

export default function BookingFormClient({ fasilitas }: { fasilitas: Fasilitas[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryKode = searchParams ? searchParams.get('kode') || '' : ''

  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ 
    kodeBooking: string
    namaCustomer: string
    nomorHP: string
    jenisAcara: string
    tanggalMulai: string
    tanggalSelesai: string
  } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Status search state
  const [statusResult, setStatusResult] = useState<BookingResult | null>(null)
  const [statusError, setStatusError] = useState('')
  const [isSearchingStatus, startSearchTransition] = useTransition()
  const [searchCodeInput, setSearchCodeInput] = useState('')

  // Handle URL change to fetch status details dynamically
  useEffect(() => {
    if (queryKode) {
      setStatusError('')
      setStatusResult(null)
      startSearchTransition(async () => {
        try {
          const res = await checkBookingStatus(queryKode.trim().toUpperCase())
          if (res.error) {
            setStatusError(res.error)
          } else if (res.data) {
            setStatusResult(res.data)
            // Pre-fill input search for convenience
            setSearchCodeInput(queryKode.toUpperCase())
          }
        } catch (err) {
          console.error(err)
          setStatusError('Gagal memproses data. Silakan coba beberapa saat lagi.')
        }
      })
    } else {
      // Clear status when URL is cleared
      setStatusResult(null)
      setStatusError('')
    }
  }, [queryKode])

  // Scroll smooth to elements
  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Handle checkbox changes in facilities
  const handleCheckboxChange = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Form submit handler
  const handleFormSubmit = (formData: FormData) => {
    setError('')
    formData.delete('fasilitas')
    selectedIds.forEach(id => formData.append('fasilitas', String(id)))

    if (selectedIds.length === 0) {
      setError('Harap pilih minimal 1 fasilitas area wisata yang ingin disewa.')
      return
    }

    startTransition(async () => {
      try {
        const res = await createBooking(formData)
        if (res.error) {
          setError(res.error)
          scrollToId('form-card')
        } else if (res.kodeBooking) {
          setResult({ 
            kodeBooking: res.kodeBooking,
            namaCustomer: formData.get('namaCustomer') as string,
            nomorHP: formData.get('nomorHP') as string,
            jenisAcara: formData.get('jenisAcara') as string,
            tanggalMulai: formData.get('tanggalMulai') as string,
            tanggalSelesai: formData.get('tanggalSelesai') as string,
          })
          // Scroll to top to see success state
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } catch (err) {
        console.error(err)
        setError('Terjadi kesalahan koneksi sistem. Silakan coba kembali.')
      }
    })
  }

  // Copy booking code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate and redirect to WhatsApp API for confirmation
  const handleWhatsAppConfirm = () => {
    if (!result) return
    const adminNumber = '6285643309636'
    
    const formatLabelTanggal = (tglStr: string) => {
      try {
        return new Date(tglStr).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      } catch {
        return tglStr
      }
    }

    const text = `Halo Pengelola Pantai Mliwis, saya baru saja mengajukan permohonan booking tempat dengan rincian berikut:

*Kode Booking:* ${result.kodeBooking}
*Nama Customer:* ${result.namaCustomer}
*Nomor HP:* ${result.nomorHP}
*Jenis Acara:* ${result.jenisAcara}
*Tanggal:* ${formatLabelTanggal(result.tanggalMulai)} s/d ${formatLabelTanggal(result.tanggalSelesai)}

Mohon bantuan untuk melakukan verifikasi pemesanan kami. Terima kasih!`

    const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  // Handle trigger status search
  const handleSearchStatus = (code: string) => {
    const cleanCode = code.trim().toUpperCase()
    if (!cleanCode) return
    router.push(`/booking?kode=${cleanCode}`)
  }

  // Handle back to booking form
  const handleBackToBooking = () => {
    setResult(null)
    setSelectedIds([])
    setError('')
    router.push('/booking')
  }

  // Render Status View
  if (queryKode) {
    const cfg = statusResult ? statusConfig[statusResult.status as keyof typeof statusConfig] : null

    return (
      <div style={{ background: 'var(--color-surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <PublicHeader transparentByDefault={false} />

        <main style={{ flex: 1, padding: '120px 24px 80px', backgroundColor: 'var(--color-surface-alt)' }}>
          <div className="landing-container" style={{ maxWidth: '720px', margin: '0 auto' }}>
            
            {/* Nav Back Link */}
            <div style={{ marginBottom: '24px' }}>
              <button 
                onClick={handleBackToBooking}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--color-primary-800)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer', 
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
              >
                <ArrowLeft size={16} />
                <span>Kembali ke Pendaftaran Booking</span>
              </button>
            </div>

            {/* Loading State */}
            {isSearchingStatus && (
              <div className="card text-center" style={{ padding: '60px 24px', borderRadius: '24px', border: '1px solid var(--color-border-subtle)' }}>
                <div className="spinner" style={{ margin: '0 auto 20px' }} />
                <p className="text-muted" style={{ fontWeight: 500 }}>Mengambil data status booking Anda...</p>
              </div>
            )}

            {/* Error State */}
            {statusError && !isSearchingStatus && (
              <div className="card text-center" style={{ padding: '48px 32px', borderRadius: '24px', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <XCircle size={56} style={{ color: 'var(--color-danger)', margin: '0 auto 16px' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-950)', marginBottom: '12px' }}>
                  Pencarian Gagal
                </h2>
                <div style={{ backgroundColor: 'rgba(227, 52, 47, 0.1)', color: '#721c24', padding: '12px 18px', borderRadius: '12px', fontSize: '0.925rem', marginBottom: '24px', border: '1px solid rgba(227, 52, 47, 0.2)' }}>
                  {statusError}
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={handleBackToBooking} className="btn btn-outline">Booking Baru</button>
                  <button onClick={() => handleSearchStatus(queryKode)} className="btn btn-primary">Coba Lagi</button>
                </div>
              </div>
            )}

            {/* Result State */}
            {statusResult && cfg && !isSearchingStatus && (
              <div 
                className="card" 
                style={{ 
                  animation: 'slideUp 0.4s ease-out', 
                  border: '1px solid var(--color-border-subtle)', 
                  borderRadius: '28px', 
                  boxShadow: 'var(--shadow-md)', 
                  backgroundColor: 'white',
                  overflow: 'hidden'
                }}
              >
                {/* Visual Status Banner */}
                <div 
                  style={{ 
                    backgroundColor: cfg.bgColor, 
                    borderBottom: `1px solid ${cfg.borderColor}`, 
                    padding: '32px 24px', 
                    textAlign: 'center' 
                  }}
                >
                  <div style={{ color: cfg.color, display: 'inline-flex', marginBottom: '12px' }}>{cfg.icon}</div>
                  <h2 style={{ color: '#0f2556', fontSize: '1.65rem', fontWeight: 800, margin: '0 0 8px' }}>{cfg.label}</h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto', lineHeight: '1.5' }}>
                    {cfg.desc}
                  </p>
                </div>

                <div className="card-body" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#0f2556', fontWeight: 700, marginBottom: '20px', borderBottom: '2px solid var(--color-border-light)', paddingBottom: '8px' }}>
                    Informasi Reservasi
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', margin: '0 0 4px' }}>
                        Kode Booking
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-primary-600)' }}>
                          {statusResult.kodeBooking}
                        </span>
                        <button 
                          onClick={() => handleCopyCode(statusResult.kodeBooking)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-primary-500)', cursor: 'pointer', display: 'inline-flex', padding: '4px' }}
                          title="Salin kode booking"
                        >
                          <Copy size={16} />
                        </button>
                        {copied && <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: 600 }}>Tersalin!</span>}
                      </div>
                    </div>

                    <div>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', margin: '0 0 4px' }}>
                        Tanggal Pengajuan
                      </p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f2556', margin: 0 }}>
                        {formatTanggal(statusResult.tanggalMulai)}
                        {statusResult.tanggalMulai !== statusResult.tanggalSelesai && (
                          <> s.d <br />{formatTanggal(statusResult.tanggalSelesai)}</>
                        )}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', margin: '0 0 4px' }}>
                        Nama Pemohon
                      </p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                        {statusResult.namaCustomer}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', margin: '0 0 4px' }}>
                        Nomor WhatsApp
                      </p>
                      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
                        {statusResult.nomorHP}
                      </p>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', margin: '0 0 4px' }}>
                        Deskripsi Acara
                      </p>
                      <p style={{ fontSize: '0.95rem', color: 'var(--color-text)', margin: 0, lineHeight: 1.5 }}>
                        {statusResult.jenisAcara}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
                      Fasilitas yang Disewa
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {statusResult.fasilitas.map((f) => (
                        <span 
                          key={f} 
                          style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: 600, 
                            backgroundColor: 'var(--color-primary-50)', 
                            color: 'var(--color-primary-700)', 
                            padding: '6px 14px', 
                            borderRadius: '20px',
                            border: '1px solid rgba(20, 162, 186, 0.15)'
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {statusResult.catatanPengelola && (
                    <div 
                      style={{ 
                        marginTop: '28px', 
                        padding: '16px 20px', 
                        backgroundColor: '#f8fafc', 
                        borderRadius: '16px', 
                        border: '1px solid var(--color-border-subtle)',
                        display: 'flex',
                        gap: '12px'
                      }}
                    >
                      <Info size={20} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '0.875rem', fontWeight: 700, color: '#0f2556' }}>
                          Catatan dari Pengelola
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                          {statusResult.catatanPengelola}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hubungi Pengelola Button & Back */}
                  <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <a 
                      href={`https://wa.me/6285643309636?text=Halo%20Pengelola%20Pantai%20Mliwis%2C%20saya%20ingin%20koordinasi%20mengenai%20booking%20tempat%20dengan%20kode%20booking%20%2A${statusResult.kodeBooking}%2A.`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ justifyContent: 'center', padding: '14px', borderRadius: '12px', fontSize: '0.975rem' }}
                    >
                      <Phone size={18} />
                      <span>Koordinasi via WhatsApp (+62 856-4330-9636)</span>
                    </a>

                    <button 
                      onClick={handleBackToBooking}
                      className="btn btn-outline"
                      style={{ justifyContent: 'center', padding: '14px', borderRadius: '12px', fontSize: '0.975rem', backgroundColor: 'transparent' }}
                    >
                      <ArrowLeft size={16} />
                      <span>Kembali ke Halaman Utama Booking</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </main>

        <PublicFooter />
      </div>
    )
  }

  // Render Success View (Local success state after submit)
  if (result) {
    return (
      <div style={{ background: 'var(--color-surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <PublicHeader transparentByDefault={false} />

        <main style={{ flex: 1, padding: '140px 24px 80px', display: 'flex', alignItems: 'center' }}>
          <div className="landing-container" style={{ width: '100%' }}>
            <div 
              className="card" 
              style={{ 
                animation: 'bounceIn 0.5s ease-out', 
                maxWidth: '580px', 
                margin: '0 auto', 
                border: '1px solid var(--color-border)', 
                borderRadius: '28px', 
                boxShadow: 'var(--shadow-md)' 
              }}
            >
              <div className="card-body text-center" style={{ padding: '48px 32px' }}>
                <div 
                  style={{ 
                    width: '72px', 
                    height: '72px', 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(20, 162, 186, 0.1)', 
                    color: '#14a2ba', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}
                >
                  <CheckCircle size={40} />
                </div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f2556', marginBottom: '8px' }}>
                  Booking Berhasil Diajukan!
                </h1>
                <p className="text-muted" style={{ fontSize: '0.95rem', marginBottom: '28px' }}>
                  Harap simpan kode booking Anda untuk memantau status persetujuan dari pihak pengelola.
                </p>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', fontWeight: 600 }}>
                  Kode Pelacakan Booking Anda
                </p>
                <div 
                  style={{ 
                    fontSize: '2.25rem', 
                    fontFamily: 'var(--font-heading)', 
                    fontWeight: 800, 
                    color: '#14a2ba', 
                    letterSpacing: '0.05em', 
                    marginBottom: '20px',
                    padding: '12px',
                    background: 'var(--color-surface-alt)',
                    borderRadius: '16px',
                    border: '1px dashed rgba(20, 162, 186, 0.4)'
                  }}
                >
                  {result.kodeBooking}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '32px', maxWidth: '320px', margin: '0 auto 32px' }}>
                  <button 
                    onClick={handleWhatsAppConfirm}
                    className="btn w-full"
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '12.5px 20px',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      backgroundColor: '#22c55e',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#22c55e')}
                  >
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.166.001 6.141 1.233 8.375 3.47 2.233 2.237 3.461 5.214 3.46 8.384-.002 6.535-5.328 11.859-11.859 11.859-2.007-.001-3.98-.51-5.74-1.482L0 24zm6.59-4.846c1.785 1.059 3.55 1.603 5.26 1.604 5.26 0 9.54-4.28 9.54-9.54 0-2.548-.992-4.945-2.793-6.747C16.855 2.67 14.462 1.678 11.91 1.678c-5.26 0-9.54 4.28-9.54 9.542 0 1.9.497 3.753 1.438 5.4l-.946 3.454 3.535-.928-.198-.124zm11.396-6.195c-.313-.156-1.853-.915-2.134-1.018-.282-.102-.487-.153-.692.156-.205.308-.795 1.018-.974 1.222-.179.205-.359.227-.672.07-.313-.156-1.32-.486-2.515-1.552-.928-.828-1.555-1.85-1.737-2.162-.182-.313-.02-.482.137-.638.14-.14.313-.365.47-.547.156-.182.208-.312.313-.52.104-.208.052-.39-.026-.547-.078-.156-.692-1.67-.949-2.288-.25-.6-.525-.516-.72-.526-.179-.01-.384-.01-.59-.01-.205 0-.54.078-.823.39-.282.313-1.077 1.053-1.077 2.566 0 1.513 1.1 2.978 1.253 3.187.153.208 2.163 3.303 5.24 4.633.73.316 1.3.504 1.745.646.734.233 1.402.2 1.93.12.588-.088 1.853-.758 2.115-1.458.263-.7.263-1.3.183-1.458-.08-.156-.285-.25-.598-.406z"/>
                    </svg>
                    <span>Konfirmasi via WhatsApp</span>
                  </button>
                  <button 
                    className="btn btn-outline w-full" 
                    onClick={() => handleCopyCode(result.kodeBooking)}
                    style={{ fontSize: '0.875rem', borderRadius: '12px', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Copy size={14} />
                    <span>{copied ? 'Tersalin!' : 'Salin Kode Booking'}</span>
                  </button>
                </div>
                
                <div 
                  style={{ 
                    borderTop: '1px solid var(--color-border-subtle)', 
                    paddingTop: '24px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px' 
                  }}
                >
                  <button 
                    onClick={() => handleSearchStatus(result.kodeBooking)}
                    className="btn btn-primary"
                    style={{ justifyContent: 'center', padding: '12px', borderRadius: '10px', fontSize: '0.95rem' }}
                  >
                    <Search size={16} />
                    <span>Lacak Status Sekarang</span>
                  </button>
                  
                  <button 
                    onClick={handleBackToBooking}
                    className="btn btn-ghost"
                    style={{ justifyContent: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}
                  >
                    Buat Permohonan Booking Lain
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <PublicFooter />
      </div>
    )
  }

  // Render Regular View (Main Page with Calendar + Form + Search Input)
  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader transparentByDefault={true} />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.65)), url("/mahasiswa di mliwis.jpg")',
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
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <Waves size={14} />
            <span>Portal Reservasi Resmi</span>
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'white', lineHeight: 1.15 }}>
            Booking Tempat & Acara
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', marginTop: '16px', lineHeight: '1.6', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
            Lihat ketersediaan tanggal, ajukan sewa area Pantai Mliwis, dan lacak status permohonan Anda secara langsung.
          </p>

          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => scrollToId('calendar-section')}
              className="btn btn-primary"
              style={{ padding: '14px 28px', fontSize: '0.95rem' }}
            >
              <Calendar size={18} />
              <span>Lihat Kalender & Form</span>
            </button>
            <button 
              onClick={() => scrollToId('cek-status-section')}
              className="btn btn-outline"
              style={{ padding: '14px 28px', fontSize: '0.95rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Search size={18} />
              <span>Cek Status Booking</span>
            </button>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendar-section" style={{ padding: '80px 0 40px', backgroundColor: 'var(--color-surface)' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="landing-tagline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: '30px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
              <Calendar size={14} />
              <span>Tanggal Ketersediaan</span>
            </span>
            <h2 style={{ fontSize: '2.25rem', color: '#0f2556', fontWeight: 800 }}>Jadwal Ketersediaan Tempat</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '12px auto 0', lineHeight: 1.5 }}>
              Sebelum mengisi formulir pemesanan, silakan periksa kalender di bawah untuk memastikan tanggal acara Anda belum dipesan oleh pihak lain.
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-subtle)' }}>
            <BookingCalendar />
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section id="form-section" style={{ padding: '40px 0 80px', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="landing-tagline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: '30px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
              <Send size={14} />
              <span>Formulir Pengajuan</span>
            </span>
            <h2 style={{ fontSize: '2.25rem', color: '#0f2556', fontWeight: 800 }}>Formulir Pengajuan Sewa Area</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '12px auto 0', lineHeight: 1.5 }}>
              Isi data penanggung jawab, tanggal sewa, deskripsi acara, serta pilih fasilitas yang akan digunakan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
            
            {/* Guidelines Card */}
            <aside style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ color: '#0f2556', borderBottom: '2px solid var(--color-border-light)', paddingBottom: 12, marginBottom: 20, fontSize: '1.15rem', fontWeight: 800 }}>
                Panduan Pemesanan
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>1</span>
                  <div>
                    <h5 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, color: '#0f2556' }}>Lengkapi Kredensial</h5>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>Masukkan nama penanggung jawab / instansi dan nomor WhatsApp aktif Anda.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>2</span>
                  <div>
                    <h5 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, color: '#0f2556' }}>Pilih Tanggal Acara</h5>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>Tentukan tanggal mulai dan selesai acara sesuai ketersediaan di kalender jadwal.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>3</span>
                  <div>
                    <h5 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, color: '#0f2556' }}>Pilih Fasilitas Sewa</h5>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>Centang minimal 1 area fasilitas Pantai Mliwis yang ingin Anda reservasi.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary-50)', color: 'var(--color-primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>4</span>
                  <div>
                    <h5 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, color: '#0f2556' }}>Simpan Kode Booking</h5>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>Setelah berhasil submit, catat kode unik Anda untuk cek persetujuan admin secara berkala.</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 32, padding: 20, background: 'var(--color-surface-alt)', borderRadius: '18px', border: '1px solid var(--color-border-subtle)' }}>
                <h5 style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.875rem', color: '#0f2556', marginBottom: 10 }}>
                  <Info size={16} style={{ color: '#14a2ba' }} />
                  <span>Butuh Bantuan Koordinasi?</span>
                </h5>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.775rem', lineHeight: 1.45, marginBottom: 14 }}>
                  Silakan hubungi kontak pengelola untuk menanyakan harga paket khusus, koordinasi kebersihan, maupun kebutuhan listrik/air acara berskala besar.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a 
                    href="https://wa.me/6285643309636" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-800)', textDecoration: 'none' }}
                  >
                    <Phone size={14} style={{ color: '#14a2ba' }} />
                    <span>WhatsApp: +62 856-4330-9636</span>
                  </a>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    <MapPin size={14} style={{ color: '#14a2ba' }} />
                    <span>Ambal, Kebumen, Jawa Tengah</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Form Card */}
            <main id="form-card" style={{ scrollMarginTop: '100px' }}>
              <div className="card" style={{ border: '1px solid var(--color-border-subtle)', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', backgroundColor: 'white' }}>
                <div className="card-body" style={{ padding: '32px' }}>
                  <h3 className="mb-6" style={{ color: '#0f2556', borderBottom: '2px solid var(--color-border-light)', paddingBottom: 12, fontSize: '1.25rem', fontWeight: 800 }}>
                    Formulir Reservasi Area
                  </h3>

                  {error && (
                    <div className="alert alert-danger mb-4" style={{ borderRadius: '12px', fontSize: '0.875rem', border: '1px solid rgba(227, 52, 47, 0.2)' }}>
                      {error}
                    </div>
                  )}

                  <form action={handleFormSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 600, color: '#0f2556' }}>
                          Nama Lengkap / Instansi <span className="required">*</span>
                        </label>
                        <input name="namaCustomer" className="form-input" placeholder="Nama penanggung jawab" required style={{ borderRadius: '10px' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 600, color: '#0f2556' }}>
                          Nomor WhatsApp Aktif <span className="required">*</span>
                        </label>
                        <input name="nomorHP" className="form-input" placeholder="Contoh: 0823xxxxxxxx" required style={{ borderRadius: '10px' }} />
                      </div>
                    </div>
                    
                    <div className="form-row" style={{ marginTop: '16px' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 600, color: '#0f2556' }}>
                          Tanggal Mulai Sewa <span className="required">*</span>
                        </label>
                        <input name="tanggalMulai" type="date" className="form-input" required style={{ borderRadius: '10px' }} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 600, color: '#0f2556' }}>
                          Tanggal Selesai Sewa <span className="required">*</span>
                        </label>
                        <input name="tanggalSelesai" type="date" className="form-input" required style={{ borderRadius: '10px' }} />
                      </div>
                    </div>
                    
                    <div className="form-group" style={{ marginTop: '16px' }}>
                      <label className="form-label" style={{ fontWeight: 600, color: '#0f2556' }}>
                        Jenis & Deskripsi Kegiatan <span className="required">*</span>
                      </label>
                      <textarea
                        name="jenisAcara"
                        className="form-input"
                        placeholder="Deskripsikan acara secara detail (misal: Makrab 30 Mahasiswa Teknik, Outbound Karyawan, Acara Prewedding)."
                        required
                        rows={4}
                        style={{ resize: 'vertical', width: '100%', borderRadius: '10px' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: '24px' }}>
                      <label className="form-label" style={{ marginBottom: 4, fontWeight: 700, color: '#0f2556' }}>
                        Pilih Fasilitas Area Pantai Mliwis <span className="required">*</span>
                      </label>
                      <p className="text-muted" style={{ marginBottom: 14, fontSize: '0.75rem' }}>
                        Centang satu atau beberapa area. Klik ikon <ExternalLink size={11} style={{ verticalAlign: 'middle' }} /> untuk melihat info lengkap fasilitas bersangkutan.
                      </p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                        {fasilitas.map((f) => {
                          const slug = facilitySlugMap[f.nama]
                          const isChecked = selectedIds.includes(f.id)
                          return (
                            <div key={f.id} style={{ position: 'relative' }}>
                              <label
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '12px',
                                  border: isChecked ? '2px solid #14a2ba' : '2px solid var(--color-border-subtle)',
                                  borderRadius: '14px',
                                  cursor: 'pointer',
                                  backgroundColor: isChecked ? 'rgba(20, 162, 186, 0.05)' : 'white',
                                  transition: 'all 0.2s ease',
                                  gap: '8px'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleCheckboxChange(f.id)}
                                  style={{ 
                                    accentColor: '#14a2ba', 
                                    cursor: 'pointer',
                                    width: '16px',
                                    height: '16px'
                                  }}
                                />
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                  <span style={{ color: isChecked ? '#14a2ba' : 'var(--color-text-muted)' }}>
                                    {facilityIcons[f.nama] || <Tent size={20} />}
                                  </span>
                                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0f2556' }}>
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
                                      padding: '4px',
                                    }}
                                    title={`Lihat info ${f.nama}`}
                                  >
                                    <ExternalLink size={13} />
                                  </a>
                                )}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-full" 
                      style={{ marginTop: '28px', padding: '14px', borderRadius: '12px', justifyContent: 'center', backgroundColor: '#0f2556' }} 
                      disabled={isPending}
                    >
                      {isPending ? (
                        <><span className="spinner spinner-sm spinner-white" /> Mengirim Pengajuan...</>
                      ) : (
                        <><Send size={18} /> Ajukan Booking Sewa</>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </main>
          </div>

          {/* Cek Status Booking Section */}
          <div id="cek-status-section" style={{ maxWidth: '650px', margin: '80px auto 0', scrollMarginTop: '100px' }}>
            <div 
              className="card" 
              style={{ 
                border: '1px solid var(--color-border-subtle)', 
                borderRadius: '24px', 
                boxShadow: 'var(--shadow-sm)', 
                backgroundColor: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Highlight top border */}
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #0f2556, #14a2ba)' }} />
              <div className="card-body" style={{ padding: 36 }}>
                <h4 style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: 8, color: '#0f2556', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Search size={22} style={{ color: '#14a2ba' }} />
                  <span>Sudah Mengajukan Booking?</span>
                </h4>
                <p className="text-muted" style={{ marginBottom: 20, fontSize: '0.85rem', lineHeight: 1.45 }}>
                  Masukkan kode booking unik Anda (misalnya: `BK-XXXXXXXX`) yang diberikan saat berhasil mengirim formulir sewa untuk memeriksa status validasi dari admin.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <input
                    className="form-input"
                    placeholder="Masukkan Kode Booking Anda"
                    value={searchCodeInput}
                    onChange={(e) => setSearchCodeInput(e.target.value)}
                    style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '1rem', 
                      letterSpacing: '0.05em', 
                      borderRadius: '12px', 
                      flex: 1, 
                      minWidth: '220px',
                      textTransform: 'uppercase'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchStatus(searchCodeInput)
                      }
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSearchStatus(searchCodeInput)}
                    style={{ borderRadius: '12px', padding: '0 28px', backgroundColor: '#0f2556' }}
                  >
                    <span>Lacak Status</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

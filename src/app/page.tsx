'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import * as Icons from 'lucide-react'
import BookingCalendar from '@/components/booking/BookingCalendar'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { LIST_FASILITAS } from '@/lib/data-landing'

const CAROUSEL_IMAGES = [
  '/mliwis1.jpg',
  '/mliwis2.jpg',
  '/mliwis3.jpg',
  '/mliwis4.jpg',
  '/mliwis5.jpg'
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Autoplay carousel slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="landing-layout" style={{ background: 'var(--color-surface)' }}>
      {/* Header / Navbar Bersama */}
      <PublicHeader transparentByDefault={true} />

      {/* Hero / Deskripsi Section (Full Screen Carousel) */}
      <section className="landing-hero full-screen" id="deskripsi">
        {/* Background Image Slideshow Carousel */}
        <div className="landing-hero-carousel" id="hero-carousel">
          {CAROUSEL_IMAGES.map((img, idx) => (
            <div
              key={img}
              className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
              onError={(e) => {
                // Fallback to beautiful Unsplash images if files aren't uploaded yet
                const fallbacks = [
                  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600',
                  'https://images.unsplash.com/photo-1473116763269-255448993f66?q=80&w=1600',
                  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600',
                  'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1600',
                  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1600'
                ]
                const slide = e.target as HTMLDivElement
                slide.style.backgroundImage = `url(${fallbacks[idx]})`
              }}
            />
          ))}
          <div className="carousel-overlay" />
        </div>

        {/* Hero Content (Centered Text Overlay) */}
        <div className="landing-hero-container centered" id="hero-text-overlay">
          <div className="landing-hero-content-centered">
            <div className="landing-tagline translucent" id="tagline-badge">
              <Icons.Waves size={14} />
              <span>Surga Tersembunyi di Kebumen</span>
            </div>

            <h1 className="landing-hero-title-centered" id="main-hero-title">
              Pesona Alam Asri <br />
              <span className="text-gradient-sand">Pantai Mliwis</span>
            </h1>

            <p className="landing-hero-desc-centered" id="hero-description">
              Rasakan kesegaran angin samudra berpadu dengan keteduhan hutan cemara udang yang eksotis. Terletak di pesisir Ambal, Kebumen, Pantai Mliwis menawarkan keindahan pantai pasir lembut yang luas, sangat ideal untuk rekreasi keluarga, kegiatan tim, hingga pernikahan Anda.
            </p>

            <div className="landing-hero-buttons-centered" id="hero-actions">
              <a href="#booking-calendar" className="btn btn-primary btn-lg" id="btn-cta-calendar">
                <span>Lihat Jadwal</span>
                <ArrowRight size={18} />
              </a>
              <Link
                href="/booking"
                className="btn btn-outline-white btn-lg"
                id="btn-cta-booking"
              >
                <span>Booking Tempat</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sejarah Pantai Mliwis Section */}
      <section className="landing-section" id="sejarah" style={{ padding: '90px 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="landing-tagline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: '30px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
              <Icons.History size={14} />
              <span>Jejak Sejarah & Kultur</span>
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary-950)', fontWeight: 700, letterSpacing: '-0.02em' }}>Sejarah Pantai Mliwis</h2>
            <p style={{ maxWidth: '700px', margin: '16px auto 0', color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Perjalanan destinasi pesisir yang tumbuh dari swadaya gotong royong warga Desa Kenoyojayan hingga menjadi destinasi asri bernilai budaya tinggi.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {/* Row 1: Legenda Nama */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', height: '320px' }}>
                <img
                  src="/1.png"
                  alt="Asal Usul Nama Pantai Mliwis"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600' }}
                />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.825rem' }}>
                  Ilustrasi Burung Belibis (Mliwis)
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asal-Usul Nama</span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary-950)', margin: '8px 0 16px', fontWeight: 700 }}>Mengapa Dinamakan "Mliwis"?</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '14px', fontSize: '0.975rem' }}>
                  Nama <strong>Mliwis</strong> dalam bahasa Jawa merujuk pada sejenis burung liar (belibis). Menurut cerita para sesepuh Desa Kenoyojayan dahulu kawasan pantai ini sering menjadi tempat singgah burung-burung liar tersebut saat bermigrasi.
                </p>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.975rem' }}>
                  Keberadaan burung mliwis yang banyak mendiami kawasan pesisir ini membekas di hati warga lokal, sehingga pantai ini secara lisan dinamai Pantai Mliwis oleh masyarakat sekitar.
                </p>
              </div>
            </div>

            {/* Row 2: Gotong Royong 2018 (Alternating) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div style={{ order: 2 }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pembangunan Mandiri</span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary-950)', margin: '8px 0 16px', fontWeight: 700 }}>Kekuatan Gotong Royong (2018)</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '14px', fontSize: '0.975rem' }}>
                  Pengembangan Pantai Mliwis dimulai pada tahun 2018 secara swadaya murni oleh masyarakat Desa Kenoyojayan. Warga bergotong-royong merintis destinasi ini dari lahan liar hingga layak dikunjungi.
                </p>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.975rem' }}>
                  Tanpa mengandalkan kontraktor luar, masyarakat bersama-sama membersihkan lokasi tempat usaha, menata lahan parkir, serta merapikan pepohonan agar bisa difungsikan secara produktif untuk mendongkrak kesejahteraan desa.
                </p>
              </div>
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', height: '320px', order: 1 }}>
                <img
                  src="/2.png"
                  alt="Pembangunan Swadaya Warga"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600' }}
                />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.825rem' }}>
                  Gotong Royong Warga Kenoyojayan
                </div>
              </div>
            </div>

            {/* Row 3: Tradisi Budaya */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', height: '320px' }}>
                <img
                  src="/3.png"
                  alt="Tradisi Grebeg Rolasan"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600' }}
                />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.825rem' }}>
                  Pentas Grebeg Rolasan Pesisir
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kultur & Adat</span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary-950)', margin: '8px 0 16px', fontWeight: 700 }}>Tradisi Budaya Grebeg Rolasan</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '14px', fontSize: '0.975rem' }}>
                  Salah satu kearifan lokal yang paling menonjol di Pantai Mliwis adalah diadakannya upacara adat **Grebeg Rolasan** atau *Grebeg Enthak-Enthik/Menthak-Menthik* setiap peringatan Maulid Nabi Muhammad SAW.
                </p>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.975rem' }}>
                  Warga melakukan arak-arakan gunungan hasil bumi melimpah dari balai desa menuju pantai, diakhiri dengan doa bersama dan perebutan gunungan oleh ribuan pengunjung sebagai bentuk kesyukuran atas berkah bumi.
                </p>
              </div>
            </div>

            {/* Row 4: Akses & Parkir Terjangkau (Alternating) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div style={{ order: 2 }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Informasi Kunjungan</span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary-950)', margin: '8px 0 16px', fontWeight: 700 }}>Akses Mudah & Parkir Terjangkau</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '14px', fontSize: '0.975rem' }}>
                  Pantai Mliwis berjarak hanya 17 km dari pusat Kota Kebumen, dengan waktu tempuh sekitar 20 menit berkendara. Akses jalannya sudah dilapisi aspal halus dan terhubung langsung dengan JJLS (Jalur Jalan Lintas Selatan).
                </p>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.975rem' }}>
                  Untuk masuk ke area wisata, pengunjung hanya dikenakan biaya **Jasa Penitipan Kendaraan (JPK)** yang sangat terjangkau: **Rp 3.000 untuk sepeda motor** dan **Rp 5.000 untuk mobil**, tanpa biaya masuk individu yang mahal.
                </p>
              </div>
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', height: '320px', order: 1 }}>
                <img
                  src="/4.png"
                  alt="Akses Jalan dan JPK"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1473116763269-255448993f66?q=80&w=600' }}
                />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.825rem' }}>
                  Akses Jalan Masuk Pantai Mliwis
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="landing-section alt" id="fasilitas" style={{ backgroundColor: 'var(--color-surface-alt)', padding: '90px 0' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="landing-tagline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: '30px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
              <Icons.Sparkles size={14} />
              <span>Kenyamanan Wisatawan</span>
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary-950)', fontWeight: 700 }}>Fasilitas Unggulan Kami</h2>
            <p style={{ maxWidth: '700px', margin: '16px auto 0', color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Berbagai fasilitas dan layanan khusus telah disiapkan oleh Pokdarwis Pantai Mliwis demi menjamin kenyamanan rekreasi Anda.
            </p>
          </div>

          <div className="facility-grid" id="facility-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {LIST_FASILITAS.map((item) => {
              const IconComp = (Icons as any)[item.icon] || Icons.HelpCircle
              return (
                <Link
                  key={item.slug}
                  href={`/fasilitas/${item.slug}`}
                  className="facility-card-item"
                  id={`facility-${item.slug}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    textDecoration: 'none',
                    color: 'inherit',
                    height: '100%',
                    border: '1px solid var(--color-border-subtle)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ width: '100%', height: '170px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={`/${item.slug}-1.png`}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback images based on index
                        const placeholders = [
                          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=400', // camping
                          'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=400', // payung
                          'https://images.unsplash.com/photo-1597935258735-e254c1839512?q=80&w=400', // musola
                          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400', // kuliner
                          'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=400', // pendopo
                          'https://images.unsplash.com/photo-1470246973918-29a93221c455?q=80&w=400', // tikar
                          'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?q=80&w=400', // kuda
                          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400', // gazebo
                          'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=400', // ayunan
                          'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=400', // parkir
                          'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=400', // kolam renang
                          'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=400', // atv
                          'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400'  // cemara
                        ]
                        const index = LIST_FASILITAS.findIndex(f => f.slug === item.slug)
                        const fallbackUrl = placeholders[index % placeholders.length]
                        ;(e.target as HTMLImageElement).src = fallbackUrl
                      }}
                    />
                  </div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div
                      className="facility-card-icon"
                      style={{
                        marginTop: '-44px',
                        position: 'relative',
                        backgroundColor: 'var(--color-primary-600)',
                        color: 'white',
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid white',
                        boxShadow: 'var(--shadow-sm)',
                        zIndex: 5,
                        marginBottom: '12px'
                      }}
                    >
                      <IconComp size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-950)', fontWeight: 600, marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: '1.5', flex: 1 }}>
                      {item.description}
                    </p>
                    <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-700)', fontWeight: 600 }}>
                        {item.price ? item.price.split('|')[0] : ''}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-600)', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                        Detail →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Booking Calendar Section */}
      <section className="landing-section" id="booking-calendar" style={{ padding: '90px 0' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="landing-tagline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: '30px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
              <Icons.CalendarCheck size={14} />
              <span>Agenda Pantai</span>
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary-950)', fontWeight: 700 }}>Jadwal Ketersediaan Tempat</h2>
            <p style={{ maxWidth: '700px', margin: '16px auto 0', color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Lihat slot tanggal yang sudah terisi sebelum melakukan pengajuan sewa fasilitas Pantai Mliwis agar agenda Anda berjalan lancar.
            </p>
          </div>

          <div style={{ marginBottom: 48, backgroundColor: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-subtle)' }} id="interactive-calendar-wrapper">
            <BookingCalendar />
          </div>

          <div style={{ textAlign: 'center', backgroundColor: 'var(--color-primary-50)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(13, 148, 136, 0.15)' }} id="calendar-cta-box">
            <h4 style={{ marginBottom: 12, color: 'var(--color-primary-900)', fontSize: '1.35rem', fontWeight: 700 }}>Siap Merencanakan Acara Anda?</h4>
            <p className="text-muted" style={{ marginBottom: 24, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.95rem' }}>
              Ajukan sewa area dengan mengisi data secara online. Proses validasi cepat oleh tim admin pengelola Pantai Mliwis.
            </p>
            <div style={{ display: 'inline-flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/booking" className="btn btn-primary" id="btn-booking-now" style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} />
                <span>Mulai Booking Sekarang</span>
              </Link>
              <Link href="/booking/status" className="btn btn-outline" id="btn-check-status-now" style={{ padding: '12px 32px', backgroundColor: 'white', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                <span>Cek Status Pemesanan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bersama */}
      <PublicFooter />
    </div>
  )
}

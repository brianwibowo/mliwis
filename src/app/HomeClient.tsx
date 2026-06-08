'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Play, Image as ImageIcon, Waves, HeartHandshake, MapPin, ExternalLink, CalendarCheck } from 'lucide-react'
import * as Icons from 'lucide-react'
import BookingCalendar from '@/components/booking/BookingCalendar'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { formatTanggal } from '@/lib/format'

const CAROUSEL_IMAGES = [
  '/mliwis1.jpg',
  '/mliwis2.jpg',
  '/mliwis3.jpg',
  '/mliwis4.jpg',
  '/mliwis5.jpg'
]

// Curator list of exactly 6 photos with distinct categories for the Bento Grid gallery
const GALLERY_IMAGES = [
  { src: '/vibes1.JPG', title: 'Pohon Cemara Udang', category: 'Alam' },
  { src: '/kolam renang 1.JPG', title: 'Kolam Renang Anak Pesisir', category: 'Wahana' },
  { src: '/kuda pantai 1.JPG', title: 'Wisata Kuda Pantai', category: 'Aktivitas' },
  { src: '/mobil pantai1.JPG', title: 'ATV & Mobil Pantai', category: 'Petualangan' },
  { src: '/payung pantai1.JPG', title: 'Area Teduh Payung Pantai', category: 'Fasilitas' },
  { src: '/vibes2.JPG', title: 'Suasana Sunset Romantis', category: 'Alam' }
]

interface NewsItem {
  id: number
  judul: string
  slug: string
  ringkasan: string
  gambarUtama: string | null
  kategori: string
  penulis: string
  createdAt: string
}

interface HomeClientProps {
  initialNews: NewsItem[]
}

export default function HomeClient({ initialNews }: HomeClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Autoplay carousel slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const handleOpenLightbox = (idx: number) => {
    setLightboxIndex(idx)
  }

  const handleCloseLightbox = () => {
    setLightboxIndex(null)
  }

  const handleNextLightbox = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % GALLERY_IMAGES.length)
    }
  }

  const handlePrevLightbox = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)
    }
  }

  return (
    <div className="landing-layout" style={{ background: 'var(--color-surface)', overflowX: 'hidden' }}>
      {/* Header */}
      <PublicHeader transparentByDefault={true} />

      {/* 1. HERO SECTION (Carousel) */}
      <section className="landing-hero full-screen" id="deskripsi" style={{ height: '100vh', position: 'relative' }}>
        <div className="landing-hero-carousel" id="hero-carousel" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          {CAROUSEL_IMAGES.map((img, idx) => (
            <div
              key={img}
              className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${img})`,
                position: 'absolute',
                inset: 0,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: idx === currentSlide ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
                zIndex: idx === currentSlide ? 2 : 1
              }}
              onError={(e) => {
                // Fallbacks if files aren't uploaded yet
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
          <div
            className="carousel-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(12, 30, 58, 0.7) 0%, rgba(12, 30, 58, 0.5) 60%, rgba(12, 30, 58, 0.8) 100%)',
              zIndex: 3
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="landing-hero-container centered" id="hero-text-overlay" style={{ position: 'relative', zIndex: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 20px' }}>
          <div className="landing-hero-content-centered" style={{ maxWidth: '800px', textAlign: 'center' }}>
            <div
              className="landing-tagline translucent"
              id="tagline-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '6px 16px',
                borderRadius: '30px',
                marginBottom: '24px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              <Waves size={14} style={{ color: '#3b82f6' }} />
              <span>Surga Tersembunyi di Kebumen</span>
            </div>

            <h1
              className="landing-hero-title-centered"
              id="main-hero-title"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                color: 'white',
                marginBottom: '20px',
                letterSpacing: '-0.02em'
              }}
            >
              Pesona Alam Asri <br />
              <span style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Pantai Mliwis
              </span>
            </h1>

            <p
              className="landing-hero-desc-centered"
              id="hero-description"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.7,
                marginBottom: '40px',
                maxWidth: '680px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              Rasakan keindahan angin samudra berpadu dengan keteduhan hutan cemara udang eksotis. Destinasi impian keluarga untuk rekreasi, piknik, gathering, hingga booking tempat acara pesisir.
            </p>

            <div className="landing-hero-buttons-centered" id="hero-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#booking-calendar" className="btn btn-primary btn-lg" id="btn-cta-calendar" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px' }}>
                <span>Lihat Agenda</span>
                <ArrowRight size={18} />
              </a>
              <a
                href="/booking"
                className="btn btn-outline-white btn-lg"
                id="btn-cta-booking"
                style={{ padding: '14px 28px', borderRadius: '12px' }}
              >
                <span>Booking Area</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DESKRIPSI SINGKAT SECTION */}
      <section style={{ padding: '100px 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="landing-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <img
                    src="/vibes1.JPG"
                    alt="Cemara Udang Pantai Mliwis"
                    style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400' }}
                  />
                  <img
                    src="/payung pantai1.JPG"
                    alt="Relaxation"
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=400' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '40px' }}>
                  <img
                    src="/kuda pantai 1.JPG"
                    alt="Kuda Pantai Mliwis"
                    style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?q=80&w=400' }}
                  />
                  <img
                    src="/kolam renang 1.JPG"
                    alt="Wahana Bermain Anak"
                    style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=400' }}
                  />
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-20px',
                  backgroundColor: 'var(--color-primary-600)',
                  color: 'white',
                  padding: '24px',
                  borderRadius: '24px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  maxWidth: '180px'
                }}
              >
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>100%</span>
                <span style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 500 }}>Pesona Swadaya & Gotong Royong Desa</span>
              </div>
            </div>

            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: '6px 16px',
                  borderRadius: '30px',
                  marginBottom: '16px'
                }}
              >
                <HeartHandshake size={14} />
                <span>Sambutan Kehangatan Pesisir</span>
              </span>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary-950)', fontWeight: 800, lineHeight: 1.2, marginBottom: '24px', letterSpacing: '-0.02em' }}>
                Selamat Datang di Pantai Wisata Mliwis
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '20px' }}>
                Pantai Mliwis bukan sekadar destinasi pesisir biasa. Terletak di Desa Kenoyojayan, Ambal, Kebumen, pantai ini dibangun dari rasa memiliki dan semangat gotong royong warga desa sejak 2018. Keasrian alami hutan cemara udang berpadu dengan udara bersih samudra selatan memberikan atmosfer yang damai bagi setiap pengunjung.
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '32px' }}>
                Dilengkapi dengan wahana kolam renang anak air tawar yang aman, penyusuran pantai dengan kuda pesisir, penyewaan motor ATV petualangan, gazebo teduh, hingga aula joglo serbaguna (pendopo) untuk kebutuhan formal. Pantai Mliwis siap menyambut rekreasi Anda dengan kenyamanan lengkap.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', height: 'fit-content' }}>
                    <MapPin size={20} />
                  </span>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-950)', fontWeight: 600, marginBottom: '4px' }}>Lokasi Strategis</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>Hanya 17 KM dari Kota Kebumen lewat JJLS.</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ display: 'inline-flex', padding: '10px', borderRadius: '12px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', height: 'fit-content' }}>
                    <Icons.BadgePercent size={20} />
                  </span>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-950)', fontWeight: 600, marginBottom: '4px' }}>Tarif Terjangkau</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>Hanya JPK parkir, tanpa tiket masuk individu.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOTO DAN VIDEO GALLERY */}
      <section style={{ padding: '100px 0', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-primary-50)',
                color: 'var(--color-primary-700)',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '6px 16px',
                borderRadius: '30px',
                marginBottom: '16px'
              }}
            >
              <ImageIcon size={14} />
              <span>Media & Galeri</span>
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary-950)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Dokumentasi Foto & Video Keindahan
            </h2>
            <p style={{ maxWidth: '650px', margin: '16px auto 0', color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Visualisasikan indahnya liburan Anda di Pantai Mliwis. Tonton video fokus kami dan jelajahi sudut-sudut pantai yang menakjubkan.
            </p>
          </div>

          {/* Video Player: TikTok/Mobile Vertical Phone Mockup Layout */}
          <div style={{ maxWidth: '600px', margin: '0 auto 80px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }} id="video-focus-container">
            {/* Spotlight Radial Glow background */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(20, 162, 186, 0.15) 0%, rgba(20, 162, 186, 0) 70%)',
              zIndex: 1,
              pointerEvents: 'none'
            }} />

            <div className="phone-mockup" style={{ zIndex: 2 }}>
              {/* Phone Notch/Island */}
              <div className="phone-notch" />

              {/* Cover Video thumbnail */}
              {!isVideoPlaying ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url("/mliwis3.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(5, 33, 41, 0.6)',
                      zIndex: 1
                    }}
                  />
                  {/* Glowing Play Button */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-400)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 25px rgba(20, 162, 186, 0.6)',
                      transition: 'transform 0.3s ease, background-color 0.3s ease',
                      border: '3px solid rgba(255, 255, 255, 0.9)'
                    }}
                    className="play-btn-glow"
                  >
                    <Play size={24} fill="white" style={{ marginLeft: '3px' }} />
                  </div>
                  <h4 style={{ position: 'relative', zIndex: 2, color: 'white', marginTop: '16px', fontSize: '1rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.6)', textAlign: 'center', padding: '0 16px' }}>
                    Tonton Video Mliwis
                  </h4>
                </div>
              ) : (
                <video
                  src="/video_mliwis.mp4"
                  controls
                  autoPlay
                  loop
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              )}
            </div>
          </div>

          {/* Photo Gallery: Asymmetric Bento Grid Layout (Exactly 6 Images) */}
          <div className="bento-grid">
            {GALLERY_IMAGES.map((img, idx) => {
              // Standard style coordinates mapping
              let bentoStyle: React.CSSProperties = {
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                border: '1px solid var(--color-border-subtle)',
                height: '240px',
                transition: 'transform 0.3s ease'
              }

              // Bento Grid layout properties mapping
              if (idx === 2) {
                // Tall: Spans 2 rows
                bentoStyle.gridRow = 'span 2'
                bentoStyle.height = '504px'
              } else if (idx === 3) {
                // Wide: Spans 2 columns
                bentoStyle.gridColumn = 'span 2'
              } else if (idx === 5) {
                // Wide: Spans 2 columns
                bentoStyle.gridColumn = 'span 2'
              }

              return (
                <div
                  key={idx}
                  style={bentoStyle}
                  onClick={() => handleOpenLightbox(idx)}
                  className="gallery-card-hover"
                >
                  <img
                    src={img.src}
                    alt={img.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    className="gallery-image"
                  />
                  {/* Overlay on hover */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(5, 33, 41, 0.85) 0%, rgba(5, 33, 41, 0.2) 60%, rgba(5, 33, 41, 0) 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'end',
                      padding: '24px',
                      opacity: 0.9,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        color: 'var(--color-sand-400)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px'
                      }}
                    >
                      {img.category}
                    </span>
                    <h4 style={{ color: 'white', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
                      {img.title}
                    </h4>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. BERITA TERBARU SECTION */}
      <section style={{ padding: '100px 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="landing-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: '6px 16px',
                  borderRadius: '30px',
                  marginBottom: '16px'
                }}
              >
                <Icons.Newspaper size={14} />
                <span>Info & Kabar Terbaru</span>
              </span>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary-950)', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Berita Kegiatan Terkini
              </h2>
            </div>
            <Link
              href="/berita-kegiatan"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-primary-600)',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none'
              }}
            >
              <span>Lihat Semua Berita</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* News Cards */}
          {initialNews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--color-surface-alt)', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
              <Icons.FileText size={48} className="text-muted" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: 'var(--color-primary-950)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '8px' }}>Belum Ada Berita Terbaru</h3>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Admin akan segera memperbarui berita kegiatan terbaru.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {initialNews.map((news) => (
                <article
                  key={news.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  className="news-card-item"
                >
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--color-surface-alt)' }}>
                    {news.gambarUtama ? (
                      <img src={news.gambarUtama} alt={news.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-light)' }}>
                        <Icons.Newspaper size={48} />
                      </div>
                    )}
                    <span
                      style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        backgroundColor: 'var(--color-primary-600)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 12px',
                        borderRadius: '8px'
                      }}
                    >
                      {news.kategori}
                    </span>
                  </div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        <span>{formatTanggal(news.createdAt)}</span>
                      </div>
                      <span>•</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icons.User size={12} />
                        <span>{news.penulis}</span>
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-950)', fontWeight: 700, lineHeight: '1.4', margin: '0 0 12px', letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {news.judul}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: '1.6', flex: 1, margin: '0 0 20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {news.ringkasan}
                    </p>
                    <Link
                      href={`/berita-kegiatan/${news.slug}`}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-muted)',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        width: 'fit-content'
                      }}
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. BOOKING CALENDAR SECTION */}
      <section className="landing-section alt" id="booking-calendar" style={{ padding: '100px 0', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'var(--color-primary-50)',
                color: 'var(--color-primary-700)',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '6px 16px',
                borderRadius: '30px',
                marginBottom: '16px'
              }}
            >
              <CalendarCheck size={14} />
              <span>Sewa Area & Agenda</span>
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary-950)', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Jadwal Ketersediaan Tempat
            </h2>
            <p style={{ maxWidth: '650px', margin: '16px auto 0', color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Ingin mengadakan acara di Pantai Mliwis? Cek ketersediaan slot tanggal di kalender interaktif kami di bawah sebelum melakukan pengajuan.
            </p>
          </div>

          <div style={{ marginBottom: 48, backgroundColor: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-subtle)' }} id="interactive-calendar-wrapper">
            <BookingCalendar />
          </div>

          <div style={{ textAlign: 'center', backgroundColor: 'var(--color-primary-50)', padding: '48px', borderRadius: '24px', border: '1px solid rgba(13, 148, 136, 0.15)', boxShadow: 'var(--shadow-sm)' }} id="calendar-cta-box">
            <h4 style={{ marginBottom: 12, color: 'var(--color-primary-900)', fontSize: '1.4rem', fontWeight: 700 }}>
              Ingin Mengadakan Acara Sendiri?
            </h4>
            <p className="text-muted" style={{ marginBottom: 28, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Ajukan sewa area pendopo, camping ground, outbound, atau area prewedding secara online. Tim Pokdarwis akan memproses pengajuan Anda dengan cepat.
            </p>
             <div style={{ display: 'inline-flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="/booking" className="btn btn-primary" id="btn-booking-now" style={{ padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: '12px' }}>
                <Calendar size={16} />
                <span>Mulai Booking Sekarang</span>
              </a>
              <a href="/booking#cek-status-section" className="btn btn-outline" id="btn-check-status-now" style={{ padding: '12px 32px', backgroundColor: 'white', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', borderRadius: '12px' }}>
                <span>Cek Status Pemesanan</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />

      {/* LIGHTBOX FOR PHOTO GALLERY */}
      {lightboxIndex !== null && (
        <div
          className="lightbox"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.25s ease-out'
          }}
          onClick={handleCloseLightbox}
        >
          {/* Close button */}
          <button
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={handleCloseLightbox}
          >
            <Icons.X size={24} />
          </button>

          {/* Left Navigation */}
          <button
            style={{
              position: 'absolute',
              left: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            onClick={handlePrevLightbox}
          >
            <Icons.ChevronLeft size={32} />
          </button>

          {/* Image Content Container */}
          <div style={{ maxWidth: '85vw', maxHeight: '80vh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={GALLERY_IMAGES[lightboxIndex].src}
              alt={GALLERY_IMAGES[lightboxIndex].title}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: '12px',
                objectFit: 'contain',
                boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
              }}
            />
            <div style={{ marginTop: '20px', color: 'white' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {GALLERY_IMAGES[lightboxIndex].category}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '4px 0 0 0' }}>
                {GALLERY_IMAGES[lightboxIndex].title}
              </h3>
            </div>
          </div>

          {/* Right Navigation */}
          <button
            style={{
              position: 'absolute',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            onClick={handleNextLightbox}
          >
            <Icons.ChevronRight size={32} />
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Waves, Tent, TreePine, Building, Camera, Store, LogIn, ArrowRight, Phone, MapPin, Mail, Calendar } from 'lucide-react'
import BookingCalendar from '@/components/booking/BookingCalendar'

const CAROUSEL_IMAGES = [
  '/mliwis1.jpg',
  '/mliwis2.jpg',
  '/mliwis3.jpg',
  '/mliwis4.jpg',
  '/mliwis5.jpg'
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  // Autoplay carousel slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Detect page scroll to change navbar visual style dynamically
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="landing-layout" style={{ background: 'var(--color-surface)' }}>
      {/* Header / Navbar (Dinamis: Transparan vs Frosted Glass) */}
      <header className={`landing-navbar ${scrolled ? 'scrolled' : ''}`} id="main-header">
        <Link href="/" className="landing-logo" id="logo-brand">
          <span className="landing-logo-icon">
            <Waves size={20} />
          </span>
          <span>Pantai Mliwis</span>
        </Link>

        <nav className="landing-nav-links" id="desktop-nav">
          <a href="#deskripsi" className="landing-nav-link" id="nav-link-desc">Tentang Pantai</a>
          <a href="#fasilitas" className="landing-nav-link" id="nav-link-fac">Fasilitas</a>
          <a href="#booking-calendar" className="landing-nav-link" id="nav-link-cal">Jadwal Booking</a>
          <Link href="/booking" className="landing-nav-link" id="nav-link-book">Pemesanan</Link>
        </nav>

        <div className="landing-nav-actions" id="nav-actions">
          <Link 
            href="/login" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline btn-sm navbar-admin-btn" 
            id="btn-login-admin"
          >
            <LogIn size={14} />
            <span>Login Admin</span>
          </Link>
        </div>
      </header>

      {/* Hero / Deskripsi Section (Full Screen Carousel) */}
      <section className="landing-hero full-screen" id="deskripsi">
        {/* Background Image Slideshow Carousel */}
        <div className="landing-hero-carousel" id="hero-carousel">
          {CAROUSEL_IMAGES.map((img, idx) => (
            <div 
              key={img} 
              className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
          <div className="carousel-overlay" />
        </div>

        {/* Hero Content (Centered Text Overlay) */}
        <div className="landing-hero-container centered" id="hero-text-overlay">
          <div className="landing-hero-content-centered">
            <div className="landing-tagline translucent" id="tagline-badge">
              <Waves size={14} />
              <span>Surga Tersembunyi di Kebumen</span>
            </div>
            
            <h1 className="landing-hero-title-centered" id="main-hero-title">
              Pesona Alam Asri <br />
              <span className="text-gradient-sand">Pantai Mliwis</span>
            </h1>
            
            <p className="landing-hero-desc-centered" id="hero-description">
              Rasakan kesegaran angin samudra berpadu dengan keteduhan hutan cemara udang yang eksotis. Terletak di pesisir Ambal, Kebumen, Pantai Mliwis menawarkan keindahan pantai pasir lembut yang luas, sangat ideal untuk rekreasi keluarga, kegiatan tim, hingga momen sakral pernikahan Anda.
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

      {/* Facilities Section */}
      <section className="landing-section alt" id="fasilitas">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2>Fasilitas Unggulan Kami</h2>
            <p>Berbagai area khusus yang dirancang untuk kenyamanan kunjungan dan kesuksesan agenda acara Anda di Pantai Mliwis.</p>
          </div>

          <div className="facility-grid" id="facility-cards-container">
            {/* Facility 1: Camping Ground */}
            <div className="facility-card-item" id="facility-camping">
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="/mliwis1.jpg" alt="Area Camping Ground Pantai Mliwis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="facility-img" />
              </div>
              <div style={{ padding: 'var(--space-5) var(--space-6) var(--space-6)' }}>
                <div className="facility-card-icon" style={{ marginTop: '-40px', position: 'relative', border: '3px solid white', boxShadow: 'var(--shadow-md)', zIndex: 5 }}>
                  <Tent size={24} />
                </div>
                <h3 style={{ marginTop: 'var(--space-2)' }}>Area Camping Ground</h3>
                <p>Merasakan sensasi berkemah di bawah rindangnya cemara udang dengan suara deburan ombak laut selatan yang menenangkan. Dilengkapi fasilitas toilet yang bersih dan aman.</p>
              </div>
            </div>

            {/* Facility 2: Outbound */}
            <div className="facility-card-item" id="facility-outbound">
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="/mliwis2.jpg" alt="Area Outbound Pantai Mliwis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="facility-img" />
              </div>
              <div style={{ padding: 'var(--space-5) var(--space-6) var(--space-6)' }}>
                <div className="facility-card-icon" style={{ marginTop: '-40px', position: 'relative', border: '3px solid white', boxShadow: 'var(--shadow-md)', zIndex: 5 }}>
                  <TreePine size={24} />
                </div>
                <h3 style={{ marginTop: 'var(--space-2)' }}>Area Outbound</h3>
                <p>Tanah lapang luas berumput di bawah pohon rindang yang sejuk. Sangat cocok untuk permainan kelompok, team-building perusahaan, pelatihan sekolah, maupun gathering komunitas.</p>
              </div>
            </div>

            {/* Facility 3: Pendopo */}
            <div className="facility-card-item" id="facility-pendopo">
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="/mliwis3.jpg" alt="Pendopo Aula Terbuka Pantai Mliwis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="facility-img" />
              </div>
              <div style={{ padding: 'var(--space-5) var(--space-6) var(--space-6)' }}>
                <div className="facility-card-icon" style={{ marginTop: '-40px', position: 'relative', border: '3px solid white', boxShadow: 'var(--shadow-md)', zIndex: 5 }}>
                  <Building size={24} />
                </div>
                <h3 style={{ marginTop: 'var(--space-2)' }}>Pendopo / Aula Terbuka</h3>
                <p>Pendopo tradisional berkapasitas besar dengan sirkulasi udara pantai alami. Tempat yang representatif untuk pertemuan formal, perayaan syukuran, rapat dinas, maupun pentas seni.</p>
              </div>
            </div>

            {/* Facility 4: Prewedding */}
            <div className="facility-card-item" id="facility-prewedding">
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="/mliwis4.jpg" alt="Area Prewedding Pantai Mliwis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="facility-img" />
              </div>
              <div style={{ padding: 'var(--space-5) var(--space-6) var(--space-6)' }}>
                <div className="facility-card-icon" style={{ marginTop: '-40px', position: 'relative', border: '3px solid white', boxShadow: 'var(--shadow-md)', zIndex: 5 }}>
                  <Camera size={24} />
                </div>
                <h3 style={{ marginTop: 'var(--space-2)' }}>Area Prewedding</h3>
                <p>Menyajikan pemandangan alam romantis dan eksotis dengan latar belakang hutan cemara serta panorama matahari terbenam. Pilihan utama para fotografer profesional.</p>
              </div>
            </div>

            {/* Facility 5: UMKM */}
            <div className="facility-card-item" id="facility-umkm">
              <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src="/mliwis5.jpg" alt="Area UMKM Pantai Mliwis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} className="facility-img" />
              </div>
              <div style={{ padding: 'var(--space-5) var(--space-6) var(--space-6)' }}>
                <div className="facility-card-icon" style={{ marginTop: '-40px', position: 'relative', border: '3px solid white', boxShadow: 'var(--shadow-md)', zIndex: 5 }}>
                  <Store size={24} />
                </div>
                <h3 style={{ marginTop: 'var(--space-2)' }}>Area UMKM</h3>
                <p>Pusat kuliner lokal yang menyajikan hidangan laut segar khas pesisir Ambal dan kios oleh-oleh kerajinan lokal untuk mendukung perekonomian warga sekitar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Calendar Section */}
      <section className="landing-section" id="booking-calendar">
        <div className="landing-container">
          <div className="landing-section-header">
            <h2>Jadwal Ketersediaan Tempat</h2>
            <p>Lihat slot tanggal yang terisi sebelum melakukan pengajuan sewa fasilitas Pantai Mliwis agar agenda Anda berjalan lancar.</p>
          </div>

          <div style={{ marginBottom: 48 }} id="interactive-calendar-wrapper">
            <BookingCalendar />
          </div>

          <div style={{ textAlign: 'center' }} id="calendar-cta-box">
            <h4 style={{ marginBottom: 12, color: 'var(--color-primary-900)' }}>Siap Merencanakan Acara Anda?</h4>
            <p className="text-muted" style={{ marginBottom: 24, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Ajukan sewa area dengan mengisi data secara online. Proses validasi cepat oleh tim admin pengelola Pantai Mliwis.
            </p>
            <div style={{ display: 'inline-flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/booking" className="btn btn-primary" id="btn-booking-now" style={{ padding: '12px 32px' }}>
                <Calendar size={16} />
                <span>Mulai Booking Sekarang</span>
              </Link>
              <Link href="/booking/status" className="btn btn-outline" id="btn-check-status-now" style={{ padding: '12px 32px', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                <span>Cek Status Pemesanan</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer" id="main-footer">
        <div className="landing-container">
          <div className="landing-footer-grid">
            <div className="landing-footer-brand">
              <h3>Pantai Mliwis</h3>
              <p>Destinasi wisata terpadu yang memadukan keasrian alam bahari dan kemudahan penyelenggaraan acara kemasyarakatan di Kabupaten Kebumen.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                <MapPin size={16} />
                <span>Jl. Lintas Selatan, Ambal, Kebumen, Jawa Tengah</span>
              </div>
            </div>

            <div className="landing-footer-links">
              <h4>Akses Cepat</h4>
              <ul style={{ marginTop: 16 }}>
                <li><a href="#deskripsi">Tentang Pantai</a></li>
                <li><a href="#fasilitas">Fasilitas</a></li>
                <li><a href="#booking-calendar">Jadwal Booking</a></li>
                <li><Link href="/booking">Pemesanan</Link></li>
              </ul>
            </div>

            <div className="landing-footer-links">
              <h4>Hubungi Kami</h4>
              <ul style={{ marginTop: 16 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <Phone size={14} />
                  <span>+62 823-4567-8901</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                  <Mail size={14} />
                  <span>kontak@pantai-mliwis.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <p>© {new Date().getFullYear()} SI-Mliwis (Sistem Informasi Manajemen Pantai Mliwis). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

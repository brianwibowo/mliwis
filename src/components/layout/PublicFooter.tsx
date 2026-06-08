'use client'

import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'

export default function PublicFooter() {
  const quickLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang Mliwis', href: '/tentang-mliwis' },
    { label: 'Fasilitas', href: '/fasilitas' },
    { label: 'Aneka Kuliner', href: '/kuliner' },
    { label: 'Berita Kegiatan', href: '/berita-kegiatan' },
    { label: 'Booking Tempat', href: '/booking' },
  ]

  return (
    <footer className="landing-footer" id="main-footer" style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '80px 0 32px' }}>
      <div className="landing-container">
        <div className="landing-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '48px', marginBottom: '48px' }}>
          
          {/* Brand Column */}
          <div className="landing-footer-brand">
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px', color: 'white', letterSpacing: '-0.02em' }}>
              Pantai Mliwis
            </h3>
            <p style={{ opacity: 0.75, fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Destinasi wisata terpadu yang memadukan keasrian alam bahari dan kemudahan penyelenggaraan acara kemasyarakatan di Kabupaten Kebumen.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
              <MapPin size={18} style={{ flexShrink: 0, color: 'var(--color-primary-400)' }} />
              <span>Jl. Lintas Selatan, Ambal, Kebumen, Jawa Tengah</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="landing-footer-links">
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px', color: 'white', letterSpacing: '-0.01em' }}>
              Akses Cepat
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.925rem', transition: 'color 0.2s ease' }} className="footer-link-hover">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social Column */}
          <div className="landing-footer-links">
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px', color: 'white', letterSpacing: '-0.01em' }}>
              Hubungi & Ikuti Kami
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* WhatsApp */}
              <li>
                <a
                  href="https://wa.me/6285643309636"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.925rem', color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontWeight: 500 }}
                  className="footer-link-hover"
                >
                  <Phone size={16} style={{ flexShrink: 0, color: '#22c55e' }} />
                  <span>WhatsApp: +62 856-4330-9636</span>
                </a>
              </li>

              {/* Instagram */}
              <li>
                <a
                  href="https://www.instagram.com/pantaimliwisofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.925rem', color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontWeight: 500 }}
                  className="footer-link-hover"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0, color: '#ff4081' }}>
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>Instagram: @pantaimliwisofficial</span>
                </a>
              </li>

              {/* TikTok */}
              <li>
                <a
                  href="https://www.tiktok.com/@pantai.mliwis.off?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.925rem', color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontWeight: 500 }}
                  className="footer-link-hover"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0, color: '#00f2fe' }}>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.69a6.33 6.33 0 0 0 10.86 4.43 6.25 6.25 0 0 0 2.22-4.25V8.58a8.41 8.41 0 0 0 5.22 1.8V6.9a4.82 4.82 0 0 1-3.71-.21z"/>
                  </svg>
                  <span>TikTok: @pantai.mliwis.off</span>
                </a>
              </li>

              {/* Facebook */}
              <li>
                <a
                  href="https://www.facebook.com/share/g/1CtL3AimhX/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.925rem', color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', fontWeight: 500 }}
                  className="footer-link-hover"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0, color: '#1877f2' }}>
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  <span>Facebook: Pantai Mliwis</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="landing-footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ opacity: 0.6, fontSize: '0.825rem', margin: 0 }}>
            © {new Date().getFullYear()} SI-Mliwis (Sistem Informasi Manajemen Pantai Mliwis). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}


'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer className="landing-footer" id="main-footer" style={{ backgroundColor: 'var(--color-primary-900)', color: 'white', padding: '64px 0 24px' }}>
      <div className="landing-container">
        <div className="landing-footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          <div className="landing-footer-brand">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px', color: 'white' }}>Pantai Mliwis</h3>
            <p style={{ opacity: 0.75, fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '20px' }}>
              Destinasi wisata terpadu yang memadukan keasrian alam bahari dan kemudahan penyelenggaraan acara kemasyarakatan di Kabupaten Kebumen.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
              <MapPin size={16} style={{ flexShrink: 0 }} />
              <span>Jl. Lintas Selatan, Ambal, Kebumen, Jawa Tengah</span>
            </div>
          </div>

          <div className="landing-footer-links">
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: 'white' }}>Akses Cepat</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <li>
                <Link href="/" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.925rem' }}>
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/kuliner" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.925rem' }}>
                  Aneka Kuliner
                </Link>
              </li>
              <li>
                <Link href="/berita-kegiatan" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.925rem' }}>
                  Berita Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/booking" style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.925rem' }}>
                  Booking Tempat
                </Link>
              </li>
            </ul>
          </div>

          <div className="landing-footer-links">
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: 'white' }}>Hubungi Kami</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                <Phone size={14} style={{ flexShrink: 0 }} />
                <span>+62 823-4567-8901</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
                <Mail size={14} style={{ flexShrink: 0 }} />
                <span>kontak@pantai-mliwis.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="landing-footer-bottom" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ opacity: 0.6, fontSize: '0.825rem', margin: 0 }}>
            © {new Date().getFullYear()} SI-Mliwis (Sistem Informasi Manajemen Pantai Mliwis). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

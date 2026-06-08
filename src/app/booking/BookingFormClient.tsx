'use client'

import Link from 'next/link'
import { Waves, CalendarCheck, Search } from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import BookingCalendar from '@/components/booking/BookingCalendar'

export default function BookingFormClient() {
  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      {/* Header */}
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
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <Waves size={14} />
            <span>Reservasi Area Wisata</span>
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
            Booking Tempat & Acara
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginTop: '12px', lineHeight: '1.5' }}>
            Ajukan sewa area Pantai Mliwis untuk camping, outbound, gathering, maupun event formal Anda.
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section style={{ padding: '80px 0 20px', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--color-primary-950)', fontWeight: 700 }}>Jadwal Ketersediaan Tempat</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Silakan periksa tanggal yang kosong pada kalender di bawah ini sebelum mengajukan booking.</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-subtle)' }}>
            <BookingCalendar />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '40px 0 80px', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div style={{ textAlign: 'center', backgroundColor: 'var(--color-primary-50)', padding: '48px 32px', borderRadius: '24px', border: '1px solid rgba(13, 148, 136, 0.15)' }}>
            <h3 style={{ marginBottom: 12, color: 'var(--color-primary-900)', fontSize: '1.5rem', fontWeight: 700 }}>Siap Merencanakan Acara Anda?</h3>
            <p className="text-muted" style={{ marginBottom: 28, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Ajukan sewa area Pantai Mliwis dengan mengisi formulir online. Anda juga bisa mengecek status booking yang telah diajukan sebelumnya.
            </p>
            <div style={{ display: 'inline-flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a
                href="/booking/form"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '14px 36px', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem' }}
              >
                <CalendarCheck size={18} />
                <span>Mulai Booking Sekarang</span>
              </a>
              <a
                href="/booking/status"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ padding: '14px 36px', backgroundColor: 'white', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem' }}
              >
                <Search size={18} />
                <span>Cek Status Pemesanan</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}

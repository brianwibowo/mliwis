'use client'

import Link from 'next/link'
import * as Icons from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { LIST_FASILITAS } from '@/lib/data-landing'

export default function FasilitasPage() {
  const getFacilityFallback = (slug: string) => {
    const list: Record<string, string> = {
      'camping-ground': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600',
      'payung-pantai': 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=600',
      'musola': 'https://images.unsplash.com/photo-1597935258735-e254c1839512?q=80&w=600',
      'aneka-kuliner': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600',
      'pendopo': 'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=600',
      'sewa-tikar': 'https://images.unsplash.com/photo-1470246973918-29a93221c455?q=80&w=600',
      'kuda-pantai': 'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?q=80&w=600',
      'gazebo': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
      'sewa-ayunan': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=600',
      'parkir': 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=600',
      'kolam-renang-anak': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600',
      'atv-pantai': 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=600',
      'pohon-cemara': 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600'
    }
    return list[slug] || 'https://images.unsplash.com/photo-1473116763269-255448993f66?q=80&w=600'
  }

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <PublicHeader transparentByDefault={true} />

      {/* Hero / Banner Section */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
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
            <Icons.Sparkles size={14} />
            <span>Fasilitas Lengkap</span>
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
            Fasilitas Pantai Mliwis
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginTop: '12px', lineHeight: '1.5' }}>
            Nikmati kenyamanan liburan Anda bersama keluarga dengan dukungan fasilitas terbaik yang kami kelola secara profesional.
          </p>
        </div>
      </section>

      {/* Facilities Grid Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div className="facility-grid" id="facility-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {LIST_FASILITAS.map((item) => {
              const IconComp = (Icons as any)[item.icon] || Icons.HelpCircle
              const imageSrc = item.images && item.images[0] ? item.images[0] : getFacilityFallback(item.slug)
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
                      src={imageSrc}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = getFacilityFallback(item.slug)
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
                        {item.price ? item.price.split('|')[0] : 'Gratis / Jasa Sewa'}
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

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}

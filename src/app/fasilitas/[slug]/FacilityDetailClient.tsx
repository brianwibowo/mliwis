'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import * as Icons from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { FasilitasItem } from '@/lib/data-landing'

interface Props {
  item: FasilitasItem
}

export default function FacilityDetailClient({ item }: Props) {
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + item.images.length) % item.images.length)
  }

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % item.images.length)
  }

  // Fallbacks for facility photography
  const getFacilityFallback = (slug: string, idx: number) => {
    const list: Record<string, string[]> = {
      'camping-ground': [
        '/vibes1.JPG',
        '/vibes2.JPG'
      ],
      'payung-pantai': [
        '/payung pantai1.JPG',
        '/payung pantai2.JPG'
      ],
      'musola': [
        '/mushola.jpg'
      ],
      'aneka-kuliner': [
        '/pedagang dan pembeli.jpg',
        '/makanan1.jpg'
      ],
      'pendopo': [
        '/pendopo 1.jpg',
        '/pendopo 2.jpg'
      ],
      'sewa-tikar': [
        '/mliwis8.jpg',
        '/vibes_mliwis2.jpg'
      ],
      'kuda-pantai': [
        '/kuda-pantai-1.jpg',
        '/kuda-pantai-2.jpg'
      ],
      'gazebo': [
        '/mliwis4.jpg',
        '/vibes_mliwis3.jpg'
      ],
      'sewa-ayunan': [
        '/vibes_mliwis3.jpg'
      ],
      'parkir': [
        '/area tiket masuk1.jpg',
        '/area tiket masuk2.jpg',
        '/parkiran motor.jpg'
      ],
      'kolam-renang-anak': [
        '/kolam renang 1.JPG',
        '/kolam renang 2.JPG'
      ],
      'atv-pantai': [
        '/mobil pantai1.JPG',
        '/mobil pantai 2.JPG'
      ],
      'pohon-cemara': [
        '/vibes_mliwis5.jpg',
        '/mliwis2.jpg'
      ]
    }
    const urls = list[slug] || ['/mliwis3.jpg']
    return urls[idx % urls.length]
  }

  const IconComp = (Icons as any)[item.icon] || Icons.HelpCircle

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <PublicHeader transparentByDefault={true} />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.65)), url("${getFacilityFallback(item.slug, 0)}")`,
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
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Beranda</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ display: 'inline-flex', padding: '8px', borderRadius: '10px', backgroundColor: 'var(--color-primary-600)', color: 'white' }}>
              <IconComp size={20} />
            </span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
              {item.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Detail Content Section */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
            
            {/* Left Column: Image Carousel & Description */}
            <div>
              {/* Carousel Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '380px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  backgroundColor: '#f1f5f9',
                  marginBottom: '20px'
                }}
              >
                <img
                  src={item.images[activeImageIdx]}
                  alt={`${item.title} ${activeImageIdx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = getFacilityFallback(item.slug, activeImageIdx)
                  }}
                />

                {item.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                        zIndex: 10
                      }}
                    >
                      <ChevronLeft size={20} color="var(--color-primary-950)" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255,255,255,0.85)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                        zIndex: 10
                      }}
                    >
                      <ChevronRight size={20} color="var(--color-primary-950)" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {item.images.length > 1 && (
                <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {item.images.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => setActiveImageIdx(idx)}
                      style={{
                        padding: 0,
                        border: activeImageIdx === idx ? '3px solid var(--color-primary-600)' : '3px solid transparent',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        width: '72px',
                        height: '54px',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease',
                        flexShrink: 0,
                        backgroundColor: '#f1f5f9'
                      }}
                    >
                      <img
                        src={img}
                        alt="thumbnail"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = getFacilityFallback(item.slug, idx)
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-border-subtle)' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-950)', fontWeight: 700, marginBottom: '16px' }}>
                  Deskripsi Lengkap
                </h2>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '1rem', margin: 0 }}>
                  {item.longDescription}
                </p>
              </div>
            </div>

            {/* Right Column: Price & Features */}
            <div style={{ position: 'sticky', top: '96px' }}>
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '24px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border-subtle)',
                  marginBottom: '24px'
                }}
              >
                {item.price && (
                  <>
                    <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-600)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Informasi Sewa/Tiket
                    </span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-950)', margin: '8px 0 24px' }}>
                      {item.price}
                    </div>
                  </>
                )}

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-950)', marginBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '12px' }}>
                  Keunggulan & Layanan
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  {item.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: '10px', fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>
                      <Check size={16} color="var(--color-primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Direct to Booking with selected category */}
                <Link
                  href={`/booking?fasilitas=${item.slug}`}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', justifyContent: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Icons.Calendar size={16} />
                  <span>Booking Tempat Sekarang</span>
                </Link>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-primary-50)',
                  border: '1px dashed rgba(13, 148, 136, 0.3)',
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'center'
                }}
              >
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-primary-800)', lineHeight: '1.5' }}>
                  Untuk acara khusus berkapasitas besar (seperti pernikahan, outbound corporate, atau pentas seni), silakan daftarkan tanggal kegiatan Anda di formulir booking.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}

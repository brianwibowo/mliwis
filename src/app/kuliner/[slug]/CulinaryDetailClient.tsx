'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { KulinerItem } from '@/lib/data-landing'

interface Props {
  item: KulinerItem
}

export default function CulinaryDetailClient({ item }: Props) {
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + item.images.length) % item.images.length)
  }

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % item.images.length)
  }

  // Fallbacks for food photography
  const getFoodFallback = (slug: string, idx: number) => {
    const list: Record<string, string[]> = {
      'sate-ambal': [
        '/sate ambal1.jpeg',
        '/sate ambal2.jpeg'
      ],
      'emping-melinjo': [
        '/emping melinjo1.jpeg',
        '/emping melinjo2.jpeg'
      ],
      'pecel': [
        '/nasi pecel 1.jpg',
        '/nasi pecel 2.jpg'
      ],
      'mendoan': [
        '/mendoan1.jpeg',
        '/mendoan2.jpg'
      ],
      'bakwan': [
        '/bakwan 1.jpeg',
        '/bakwan 2.png'
      ],
      'tahu-isi': [
        '/tahu isi1.jpg',
        '/tahu isi 2.jpg'
      ]
    }
    const urls = list[slug] || ['/mliwis6.jpg']
    return urls[idx % urls.length]
  }

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <PublicHeader transparentByDefault={true} />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.65)), url(${getFoodFallback(item.slug, 0)})`,
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
            href="/kuliner"
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
            <span>Kembali ke Kuliner</span>
          </Link>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
            {item.title}
          </h1>
        </div>
      </section>

      {/* Detail Content Section */}
      <section style={{ padding: '60px 0', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>
            
            {/* Left Column: Image Carousel & Story */}
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
                    ;(e.target as HTMLImageElement).src = getFoodFallback(item.slug, activeImageIdx)
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
                          ;(e.target as HTMLImageElement).src = getFoodFallback(item.slug, idx)
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '24px', border: '1px solid var(--color-border-subtle)' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-950)', fontWeight: 700, marginBottom: '16px' }}>
                  Tentang Kuliner Ini
                </h2>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>
                  {item.longDescription}
                </p>
              </div>
            </div>

            {/* Right Column: Ingredients & Order Info */}
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
                      Informasi Harga
                    </span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-950)', margin: '8px 0 24px' }}>
                      {item.price}
                    </div>
                  </>
                )}

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-950)', marginBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '12px' }}>
                  Karakteristik & Bahan Utama
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {item.ingredients.map((ing, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'start', gap: '10px', fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>
                      <CheckCircle2 size={16} color="var(--color-primary-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/#sejarah"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', justifyContent: 'center', fontWeight: 600 }}
                >
                  Kunjungi Area UMKM Pantai
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
                  Kuliner khas ini diolah langsung oleh para pedagang UMKM lokal Desa Kenoyojayan menggunakan resep turun-temurun demi menjamin cita rasa otentik.
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

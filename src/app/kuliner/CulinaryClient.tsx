'use client'

import Link from 'next/link'
import * as Icons from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { LIST_KULINER } from '@/lib/data-landing'

export default function CulinaryClient() {
  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <PublicHeader transparentByDefault={true} />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.65)), url("/mliwis6.jpg")',
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
            <Icons.Utensils size={14} />
            <span>Kuliner Pesisir Kebumen</span>
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
            Aneka Kuliner Pantai Mliwis
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginTop: '12px', lineHeight: '1.5' }}>
            Jelajahi petualangan cita rasa otentik yang disajikan langsung oleh para pelaku UMKM Desa Kenoyojayan.
          </p>
        </div>
      </section>

      {/* Culinary List Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {LIST_KULINER.map((item) => (
              <div
                key={item.slug}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={item.images[0] || "/mliwis6.jpg"}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      const fallbacks = [
                        '/sate ambal1.jpeg',
                        '/emping melinjo1.jpeg',
                        '/nasi pecel 1.jpg',
                        '/mendoan1.jpeg',
                        '/bakwan 1.jpeg',
                        '/tahu isi1.jpg'
                      ]
                      const index = LIST_KULINER.findIndex(k => k.slug === item.slug)
                      ;(e.target as HTMLImageElement).src = fallbacks[index !== -1 ? index % fallbacks.length : 0]
                    }}
                  />
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-950)', fontWeight: 700, marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6', flex: 1, marginBottom: '16px' }}>
                    {item.description}
                  </p>
                  <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {item.price && (
                      <span style={{ fontSize: '0.875rem', color: 'var(--color-primary-700)', fontWeight: 700 }}>
                        {item.price.split('|')[0]}
                      </span>
                    )}
                    <Link
                      href={`/kuliner/${item.slug}`}
                      style={{
                        fontSize: '0.85rem',
                        color: 'white',
                        backgroundColor: 'var(--color-primary-600)',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        transition: 'background-color 0.2s ease',
                        marginLeft: item.price ? '0' : 'auto'
                      }}
                    >
                      Lihat Resep & Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}

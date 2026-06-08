export const dynamic = 'force-dynamic'

import Link from 'next/link'
import * as Icons from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { prisma } from '@/lib/prisma'
import { formatTanggal } from '@/lib/format'

export const metadata = {
  title: 'Berita Kegiatan Pokdarwis — Pantai Mliwis',
  description: 'Ikuti perkembangan terbaru, agenda kegiatan kemasyarakatan, serta festival budaya menarik di Pantai Mliwis Kebumen.',
}

export default async function NewsPage() {
  const beritaList = await prisma.berita.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <PublicHeader transparentByDefault={true} />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.65)), url("/mliwis10.jpg")',
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
            <Icons.CalendarDays size={14} />
            <span>Kabar & Kegiatan Pesisir</span>
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
            Berita Kegiatan Pokdarwis
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginTop: '12px', lineHeight: '1.5' }}>
            Ikuti berbagai keseruan agenda kebudayaan, pembangunan fasilitas, serta berita wisata dari Desa Kenoyojayan.
          </p>
        </div>
      </section>

      {/* News Grid Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--color-surface-alt)' }}>
        <div className="landing-container">
          {beritaList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--color-border-subtle)' }}>
              <Icons.Newspaper size={48} className="text-muted" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: 'var(--color-primary-950)', fontWeight: 700, fontSize: '1.25rem', marginBottom: '8px' }}>Belum Ada Berita</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>Pantau terus halaman ini untuk mendapatkan informasi terbaru dari kami.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
              {beritaList.map((news) => (
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
                  }}
                >
                  <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative', backgroundColor: 'var(--color-surface-alt)' }}>
                    {news.gambarUtama ? (
                      <img src={news.gambarUtama} alt={news.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icons.Newspaper size={48} className="text-muted" />
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
                        borderRadius: '8px',
                      }}
                    >
                      {news.kategori}
                    </span>
                  </div>
                  <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icons.Calendar size={12} />
                        <span>{formatTanggal(news.createdAt)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icons.User size={12} />
                        <span>{news.penulis}</span>
                      </div>
                    </div>
                    <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary-950)', fontWeight: 700, lineHeight: '1.4', margin: '0 0 12px', letterSpacing: '-0.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {news.judul}
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6', flex: 1, margin: '0 0 20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
                      <Icons.ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}

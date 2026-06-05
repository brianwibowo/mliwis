import { notFound } from 'next/navigation'
import Link from 'next/link'
import * as Icons from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { prisma } from '@/lib/prisma'
import { formatTanggal } from '@/lib/format'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const item = await prisma.berita.findUnique({
    where: { slug },
  })
  if (!item) return { title: 'Berita Tidak Ditemukan' }

  return {
    title: `${item.judul} — Kabar Pantai Mliwis`,
    description: item.ringkasan,
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const item = await prisma.berita.findUnique({
    where: { slug },
  })

  if (!item || !item.published) {
    notFound()
  }

  const blocks = item.konten as Array<{ type: string; value: string }> || []

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <PublicHeader transparentByDefault={false} />

      {/* Detail Section */}
      <article style={{ padding: '120px 24px 80px', backgroundColor: 'var(--color-surface)' }}>
        <div className="landing-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Back button */}
          <Link
            href="/berita-kegiatan"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-primary-600)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '28px',
            }}
          >
            <Icons.ArrowLeft size={16} />
            <span>Kembali ke Berita</span>
          </Link>

          {/* Category Badges & Meta */}
          <div style={{ marginBottom: '16px' }}>
            <span
              style={{
                backgroundColor: 'var(--color-primary-50)',
                color: 'var(--color-primary-700)',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '6px 16px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {item.kategori}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '2.5rem',
              lineHeight: '1.25',
              fontWeight: 850,
              color: 'var(--color-primary-950)',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            {item.judul}
          </h1>

          {/* Meta Info */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '24px',
              color: 'var(--color-text-muted)',
              fontSize: '0.9rem',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '24px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.Calendar size={16} className="text-primary" />
              <span>{formatTanggal(item.createdAt)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icons.User size={16} className="text-primary" />
              <span>Ditulis oleh <strong style={{ color: 'var(--color-text)' }}>{item.penulis}</strong></span>
            </div>
          </div>

          {/* Featured Image */}
          {item.gambarUtama && (
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                marginBottom: '40px',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <img
                src={item.gambarUtama}
                alt={item.judul}
                style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )}

          {/* Dynamic Content Rendering */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
            {blocks.map((block, i) => {
              if (block.type === 'text') {
                return (
                  <p
                    key={i}
                    style={{
                      fontSize: '1.05rem',
                      lineHeight: '1.75',
                      color: 'var(--color-text)',
                      textAlign: 'justify',
                      margin: 0,
                    }}
                  >
                    {block.value}
                  </p>
                )
              } else if (block.type === 'image' && block.value) {
                return (
                  <div
                    key={i}
                    style={{
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border-subtle)',
                      margin: '16px 0',
                    }}
                  >
                    <img
                      src={block.value}
                      alt={`Gambar konten ${i + 1}`}
                      style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )
              }
              return null
            })}
          </div>

          {/* External Link */}
          {item.linkExternal && (
            <div
              style={{
                padding: '24px',
                backgroundColor: 'var(--color-primary-50)',
                borderRadius: '20px',
                border: '1px solid rgba(13, 148, 136, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <h4 style={{ fontWeight: 700, color: 'var(--color-primary-950)', marginBottom: '4px' }}>
                  Informasi Tambahan Terkait
                </h4>
                <p style={{ color: 'var(--color-primary-800)', fontSize: '0.875rem', margin: 0 }}>
                  Kunjungi tautan eksternal untuk detail selengkapnya atau liputan media.
                </p>
              </div>
              <a
                href={item.linkExternal}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <span>Kunjungi Tautan</span>
                <Icons.ExternalLink size={16} />
              </a>
            </div>
          )}
        </div>
      </article>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}

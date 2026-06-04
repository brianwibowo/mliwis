import Link from 'next/link'
import * as Icons from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'

export const metadata = {
  title: 'Berita Kegiatan Pokdarwis — Pantai Mliwis',
  description: 'Ikuti perkembangan terbaru, agenda kegiatan kemasyarakatan, serta festival budaya menarik di Pantai Mliwis Kebumen.',
}

const MOCK_NEWS = [
  {
    id: 1,
    title: 'Festival Budaya Grebeg Rolasan Tarik Perhatian Ribuan Pengunjung',
    date: '12 Mei 2026',
    author: 'Admin Pokdarwis',
    summary: 'Arak-arakan gunungan hasil bumi raksasa menyusuri pesisir selatan sebagai bentuk rasa syukur warga Desa Kenoyojayan atas berkah melimpah.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600',
    category: 'Budaya & Tradisi',
  },
  {
    id: 2,
    title: 'Aksi Peduli Lingkungan: Penanaman 1.000 Pohon Cemara Udang',
    date: '28 April 2026',
    author: 'Pengelola Lingkungan',
    summary: 'Bekerja sama dengan Karang Taruna, Pokdarwis menanam seribu bibit cemara udang baru guna memperluas area teduh di Pantai Mliwis.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600',
    category: 'Lingkungan',
  },
  {
    id: 3,
    title: 'Wahana Baru Kolam Renang Anak & Penyewaan ATV Resmi Dibuka',
    date: '15 Maret 2026',
    author: 'Humas Mliwis',
    summary: 'Meningkatkan kenyamanan liburan keluarga, fasilitas kolam renang air tawar mini serta 10 unit motor ATV siap memanjakan para pengunjung.',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=600',
    category: 'Wahana Wisata',
  },
  {
    id: 4,
    title: 'Sukses Gelar Outbound Corporate BUMN di Area Hutan Cemara',
    date: '04 Februari 2026',
    author: 'Admin Booking',
    summary: 'Lebih dari 100 peserta mengikuti kegiatan team-building dan rapat koordinasi di Aula Terbuka Pendopo Mliwis dengan sirkulasi udara pesisir yang segar.',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600',
    category: 'Kegiatan Acara',
  },
]

export default function NewsPage() {
  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <PublicHeader transparentByDefault={true} />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          height: '360px',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.65)), url("https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=1200")',
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            {MOCK_NEWS.map((news) => (
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
                <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative' }}>
                  <img src={news.image} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    {news.category}
                  </span>
                </div>
                <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icons.Calendar size={12} />
                      <span>{news.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icons.User size={12} />
                      <span>{news.author}</span>
                    </div>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary-950)', fontWeight: 700, lineHeight: '1.4', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
                    {news.title}
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6', flex: 1, margin: '0 0 20px' }}>
                    {news.summary}
                  </p>
                  <Link
                    href={`/berita-kegiatan`}
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
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  )
}

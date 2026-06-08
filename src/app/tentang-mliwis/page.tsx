'use client'

import * as Icons from 'lucide-react'
import PublicHeader from '@/components/layout/PublicHeader'
import PublicFooter from '@/components/layout/PublicFooter'

export default function TentangMliwisPage() {
  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      {/* Header */}
      <PublicHeader transparentByDefault={true} />

      {/* Hero / Banner Section */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.65)), url("/mliwis2.jpg")',
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
            <Icons.Info size={14} />
            <span>Mengenal Lebih Dekat</span>
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
            Tentang Pantai Mliwis
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.05rem', marginTop: '12px', lineHeight: '1.5' }}>
            Sejarah panjang, gotong royong warga desa, kebudayaan lokal, dan rute perjalanan menuju Pantai Mliwis.
          </p>
        </div>
      </section>

      {/* Sejarah Pantai Mliwis Section */}
      <section className="landing-section" id="sejarah" style={{ padding: '90px 0', backgroundColor: 'var(--color-surface)' }}>
        <div className="landing-container">
          <div className="landing-section-header" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="landing-tagline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: '30px', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
              <Icons.History size={14} />
              <span>Jejak Sejarah & Kultur</span>
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary-950)', fontWeight: 700, letterSpacing: '-0.02em' }}>Sejarah Pantai Mliwis</h2>
            <p style={{ maxWidth: '700px', margin: '16px auto 0', color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Perjalanan destinasi pesisir yang tumbuh dari swadaya gotong royong warga Desa Kenoyojayan hingga menjadi destinasi asri bernilai budaya tinggi.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
            {/* Row 1: Legenda Nama */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', height: '320px' }}>
                <img
                  src="/vibes_mliwis.jpg"
                  alt="Asal Usul Nama Pantai Mliwis"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600' }}
                />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.825rem' }}>
                  Ilustrasi Burung Belibis (Mliwis)
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asal-Usul Nama</span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary-950)', margin: '8px 0 16px', fontWeight: 700 }}>Mengapa Dinamakan "Mliwis"?</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '14px', fontSize: '0.975rem' }}>
                  Nama <strong>Mliwis</strong> dalam bahasa Jawa merujuk pada sejenis burung liar (belibis). Menurut cerita para sesepuh Desa Kenoyojayan dahulu kawasan pantai ini sering menjadi tempat singgah burung-burung liar tersebut saat bermigrasi.
                </p>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.975rem' }}>
                  Keberadaan burung mliwis yang banyak mendiami kawasan pesisir ini membekas di hati warga lokal, sehingga pantai ini secara lisan dinamai Pantai Mliwis oleh masyarakat sekitar.
                </p>
              </div>
            </div>

            {/* Row 2: Gotong Royong 2018 (Alternating) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div style={{ order: 2 }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pembangunan Mandiri</span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary-950)', margin: '8px 0 16px', fontWeight: 700 }}>Kekuatan Gotong Royong (2018)</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '14px', fontSize: '0.975rem' }}>
                  Pengembangan Pantai Mliwis dimulai pada tahun 2018 secara swadaya murni oleh masyarakat Desa Kenoyojayan. Warga bergotong-royong merintis destinasi ini dari lahan liar hingga layak dikunjungi.
                </p>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.975rem' }}>
                  Tanpa mengandalkan kontraktor luar, masyarakat bersama-sama membersihkan lokasi tempat usaha, menata lahan parkir, serta merapikan pepohonan agar bisa difungsikan secara produktif untuk mendongkrak kesejahteraan desa.
                </p>
              </div>
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', height: '320px', order: 1 }}>
                <img
                  src="/gotong royong.jpg"
                  alt="Pembangunan Swadaya Warga"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600' }}
                />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.825rem' }}>
                  Gotong Royong Warga Kenoyojayan
                </div>
              </div>
            </div>

            {/* Row 3: Tradisi Budaya */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', height: '320px' }}>
                <img
                  src="/grebek.webp"
                  alt="Tradisi Grebeg Rolasan"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600' }}
                />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.825rem' }}>
                  Pentas Grebeg Rolasan Pesisir
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kultur & Adat</span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary-950)', margin: '8px 0 16px', fontWeight: 700 }}>Tradisi Budaya Grebeg Rolasan</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '14px', fontSize: '0.975rem' }}>
                  Salah satu kearifan lokal yang paling menonjol di Pantai Mliwis adalah diadakannya upacara adat Grebeg Rolasan atau Grebeg Enthak-Enthik/Menthak-Menthik setiap peringatan Maulid Nabi Muhammad SAW.
                </p>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.975rem' }}>
                  Warga melakukan arak-arakan gunungan hasil bumi melimpah dari balai desa menuju pantai, diakhiri dengan doa bersama dan perebutan gunungan oleh ribuan pengunjung sebagai bentuk kesyukuran atas berkah bumi.
                </p>
              </div>
            </div>

            {/* Row 4: Akses & Parkir Terjangkau (Alternating) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
              <div style={{ order: 2 }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Informasi Kunjungan</span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--color-primary-950)', margin: '8px 0 16px', fontWeight: 700 }}>Akses Mudah & Parkir Terjangkau</h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '14px', fontSize: '0.975rem' }}>
                  Pantai Mliwis berjarak hanya 17 km dari pusat Kota Kebumen, dengan waktu tempuh sekitar 20 menit berkendara. Akses jalannya sudah dilapisi aspal halus dan terhubung langsung dengan JJLS (Jalur Jalan Lintas Selatan).
                </p>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.975rem' }}>
                  Untuk masuk ke area wisata, pengunjung hanya dikenakan biaya Jasa Penitipan Kendaraan (JPK) yang sangat terjangkau: Rp 3.000 untuk sepeda motor dan Rp 5.000 untuk mobil, tanpa biaya masuk individu yang mahal.
                </p>
              </div>
              <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', height: '320px', order: 1 }}>
                <img
                  src="/parkiran motor.jpg"
                  alt="Akses Jalan dan JPK"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.825rem' }}>
                  Akses Jalan Masuk Pantai Mliwis
                </div>
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

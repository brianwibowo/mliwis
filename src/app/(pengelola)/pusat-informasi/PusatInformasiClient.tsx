'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Mail,
  CalendarCheck,
  Wallet,
  FileText,
  ClipboardList,
  Newspaper,
  Settings,
  HelpCircle,
  Search,
  BookOpen,
  Shield,
  User,
  ArrowRight
} from 'lucide-react'

// Information items data definition
interface InfoItem {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  subTitle: string
  fungsi: string
  penjelasan: string[]
  role: 'semua' | 'admin'
  link: string
}

const infoData: InfoItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard (Beranda Utama)',
    icon: LayoutDashboard,
    subTitle: 'Ringkasan operasional harian obyek wisata',
    fungsi: 'Melihat ringkasan kondisi obyek wisata Pantai Mliwis hari ini secara cepat dan sekilas.',
    penjelasan: [
      'Menampilkan data jumlah kunjungan hari ini, status booking tempat aktif, dan total transaksi yang tercatat.',
      'Grafik tren mingguan atau bulanan membantu Anda membaca perkembangan kunjungan pengunjung secara visual.',
      'Cocok dipantau setiap pagi untuk melihat agenda kerja dan aktivitas penyewaan tempat hari ini.'
    ],
    role: 'semua',
    link: '/dashboard'
  },
  {
    id: 'arsip-surat',
    label: 'Arsip Surat (Manajemen Dokumen)',
    icon: Mail,
    subTitle: 'Pencatatan dan penyimpanan dokumen surat-menyurat resmi',
    fungsi: 'Mengarsipkan surat masuk dan surat keluar resmi agar tersusun rapi, aman, dan mudah dicari kembali.',
    penjelasan: [
      'Surat Masuk: Untuk mendokumentasikan surat dari pihak luar (seperti dinas, sponsor, dll). Anda bisa mengetik nomor surat, pengirim, perihal, dan melampirkan foto/file suratnya.',
      'Surat Keluar: Untuk mengarsipkan surat resmi yang dikeluarkan oleh Pokdarwis Pantai Mliwis.',
      'Generator Surat: Anda bisa mencetak surat resmi ber-KOP secara instan. Cukup klik "Buat Surat", isi form isian singkat, dan unduh sebagai file PDF siap tanda tangan tanpa perlu Microsoft Word.'
    ],
    role: 'semua',
    link: '/arsip-surat/masuk'
  },
  {
    id: 'booking',
    label: 'Booking (Reservasi Tempat)',
    icon: CalendarCheck,
    subTitle: 'Pengelolaan sewa area wisata Pantai Mliwis',
    fungsi: 'Mengatur penyewaan area (Camping Ground, Pendopo, Outbound, dll) secara terpadu untuk mencegah bentrokan jadwal.',
    penjelasan: [
      'Data Booking: Berisi kalender jadwal ketersediaan area dan daftar pemesanan pengunjung yang telah disetujui.',
      'Validasi Booking: Halaman untuk memeriksa pengajuan booking online dari pengunjung umum. Pengelola dapat menyetujui (valid) atau menolak pengajuan tersebut.',
      'Indikator status berwarna memudahkan Anda membedakan status pengajuan booking secara instan.'
    ],
    role: 'semua',
    link: '/booking-admin'
  },
  {
    id: 'transaksi',
    label: 'Transaksi (Pembukuan Keuangan)',
    icon: Wallet,
    subTitle: 'Pencatatan kas masuk dan kas keluar harian',
    fungsi: 'Mencatat arus uang yang masuk dan keluar secara tertib untuk menjaga transparansi pembukuan keuangan.',
    penjelasan: [
      'Kas Masuk: Mencatat uang masuk dari tiket pengunjung, sewa pendopo, sewa camping, iuran mitra, dan sponsor.',
      'Kas Keluar: Mencatat biaya operasional seperti honor pengelola, kebersihan pantai, perawatan alat, dan konsumsi rapat.',
      'Form pencatatan dibuat sederhana agar pengelola tidak kesulitan menginput nominal keuangan.'
    ],
    role: 'semua',
    link: '/transaksi/kas-masuk'
  },
  {
    id: 'laporan',
    label: 'Laporan (Cetak & Ekspor PDF)',
    icon: FileText,
    subTitle: 'Pembuatan dokumen pertanggungjawaban resmi',
    fungsi: 'Menyusun laporan data pengunjung dan pembukuan kas bulanan dalam bentuk dokumen PDF siap cetak.',
    penjelasan: [
      'Laporan Pengunjung: Menyajikan data jumlah pengunjung berdasarkan kategori (balita, anak, dewasa) per periode.',
      'Laporan Keuangan: Menyusun neraca pemasukan, pengeluaran, serta saldo akhir bulanan.',
      'File PDF yang dihasilkan sudah dilengkapi dengan KOP surat resmi dan bagian tanda tangan pengelola.'
    ],
    role: 'semua',
    link: '/laporan/pengunjung'
  },
  {
    id: 'program-kerja',
    label: 'Program Kerja (Agenda Kegiatan)',
    icon: ClipboardList,
    subTitle: 'Perencanaan dan pemantauan rencana kerja Pokdarwis',
    fungsi: 'Mencatat program kerja kelompok agar seluruh pengelola mengetahui agenda kegiatan mendatang dan progresnya.',
    penjelasan: [
      'Mengelompokkan rencana kerja ke dalam 3 status: Rencana, Berjalan, dan Selesai.',
      'Setiap pengelola dapat melihat perkembangan dan target pengerjaan program (misal: perbaikan fasilitas, promosi, dll).',
      'Membantu meningkatkan koordinasi kerja tim pengelola di lapangan.'
    ],
    role: 'semua',
    link: '/program-kerja'
  },
  {
    id: 'berita',
    label: 'Berita (Konten Informasi Portal)',
    icon: Newspaper,
    subTitle: 'Publikasi artikel dan pengumuman untuk pengunjung',
    fungsi: 'Mengisi konten informasi, berita kegiatan, promosi event, atau pengumuman yang tampil di website umum Pantai Mliwis.',
    penjelasan: [
      'Menulis artikel berita lengkap dengan judul, deskripsi kegiatan, isi, dan foto dokumentasi.',
      'Berita yang diterbitkan akan langsung dapat dibaca oleh masyarakat umum di halaman depan website.',
      'Berguna sebagai sarana promosi wisata dan transparansi kegiatan Pokdarwis kepada publik.'
    ],
    role: 'semua',
    link: '/berita-admin'
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan (Keamanan & Akun)',
    icon: Settings,
    subTitle: 'Pengelolaan akun pengelola dan keamanan sistem',
    fungsi: 'Mengatur akun pengelola (tambah staf, edit hak akses, reset password) serta memantau audit log sistem.',
    penjelasan: [
      'Kelola Akun: Digunakan untuk mendaftarkan staf pengelola baru atau menonaktifkan akun staf yang sudah tidak bertugas.',
      'Log Audit Aktivitas: Sistem otomatis mencatat riwayat tindakan pengelola (misal: siapa menginput transaksi, siapa menghapus surat) untuk meminimalkan penyalahgunaan wewenang.',
      'Menu ini memiliki pengamanan ekstra demi menjaga integritas data obyek wisata.'
    ],
    role: 'admin',
    link: '/pengaturan'
  }
]

export default function PusatInformasiClient() {
  const [search, setSearch] = useState('')

  const filteredItems = infoData.filter(
    item =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.subTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.fungsi.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={28} className="text-primary" />
            <h1 style={{ margin: 0 }}>Pusat Informasi & Panduan</h1>
          </div>
          <p style={{ marginTop: '4px' }}>
            Penjelasan sederhana dan petunjuk praktis penggunaan modul aplikasi pengelola Pantai Mliwis
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, var(--color-primary-50) 0%, rgba(13, 148, 136, 0.05) 100%)',
          border: '1.5px solid rgba(13, 148, 136, 0.15)',
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'start'
        }}
      >
        <BookOpen size={24} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <h4 style={{ color: 'var(--color-primary-900)', fontWeight: 700, margin: '0 0 6px 0', fontSize: '1.05rem' }}>
            Panduan Non-Teknis untuk Pengelola Desa
          </h4>
          <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
            Halaman ini memuat panduan bagi staf dan admin Pokdarwis agar dapat mengoperasikan aplikasi dengan mudah. 
            Setiap modul dirancang untuk mempermudah operasional wisata di Pantai Mliwis. Gunakan kotak pencarian di bawah untuk menyaring panduan.
          </p>
          <div style={{ marginTop: '14px', padding: '12px 16px', backgroundColor: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '0.825rem' }}>
            <span style={{ fontWeight: 700, color: '#d97706', display: 'block', marginBottom: '4px' }}>💡 Tips & Catatan Penting:</span>
            <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', listStyleType: 'disc' }}>
              <li><strong>Proses Simpan / Unggah File:</strong> Jangan khawatir jika proses unggah file lampiran atau menyimpan data terasa lambat. Harap bersabar menunggu proses selesai dan pastikan Anda memiliki koneksi internet dengan sinyal yang kuat dan stabil.</li>
              <li><strong>Rekomendasi Perangkat Kerja:</strong> Tampilan sistem ini sudah sepenuhnya responsif dan mendukung HP/tablet. Namun, untuk kenyamanan menginput data, manajemen arsip, serta mencetak laporan, <strong>sangat direkomendasikan menggunakan laptop atau komputer</strong>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="filter-bar" style={{ marginBottom: '24px' }}>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            className="search-input"
            placeholder="Cari penjelasan menu atau topik panduan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Menus */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredItems.map(item => {
          const Icon = item.icon
          return (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div 
                className="card-header" 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'start',
                  paddingBottom: '12px',
                  borderBottom: '1px solid var(--color-border-light)'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '8px', 
                      background: 'var(--color-primary-50)', 
                      color: 'var(--color-primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-950)' }}>
                      {item.label}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {item.subTitle}
                    </p>
                  </div>
                </div>
                {item.role === 'admin' ? (
                  <span className="badge badge-info" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                    <Shield size={10} /> Admin Only
                  </span>
                ) : (
                  <span className="badge badge-disetujui" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}>
                    <User size={10} /> Semua Pengelola
                  </span>
                )}
              </div>

              <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <strong style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-primary-600)', letterSpacing: '0.02em' }}>
                    Fungsi Utama:
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--color-text)', lineHeight: 1.5 }}>
                    {item.fungsi}
                  </p>
                </div>

                <div>
                  <strong style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-primary-600)', letterSpacing: '0.02em' }}>
                    Cara Kerja & Petunjuk:
                  </strong>
                  <ul style={{ margin: '6px 0 0 16px', padding: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', listStyleType: 'disc' }}>
                    {item.penjelasan.map((p, idx) => (
                      <li key={idx} style={{ lineHeight: 1.5 }}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div 
                style={{ 
                  padding: '12px 16px', 
                  borderTop: '1px solid var(--color-border-light)', 
                  background: 'var(--color-surface-alt)',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <a 
                  href={item.link} 
                  className="btn btn-ghost btn-sm" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px', 
                    fontSize: '0.8rem',
                    padding: '4px 8px'
                  }}
                >
                  Buka Menu <ArrowRight size={12} />
                </a>
              </div>
            </div>
          )
        })}

        {filteredItems.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0' }}>
            <HelpCircle size={48} className="text-muted" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ margin: 0, color: 'var(--color-primary-900)' }}>Panduan tidak ditemukan</h4>
            <p className="text-muted" style={{ margin: '4px 0 0' }}>Coba masukkan kata kunci pencarian yang lain.</p>
          </div>
        )}
      </div>
    </div>
  )
}

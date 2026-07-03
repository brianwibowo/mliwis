// SI-Mliwis — Database Seed
// Jalankan: npx tsx prisma/seed.ts

import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import bcrypt from 'bcryptjs'

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'si_mliwis',
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

function randomKode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'BK-'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(8, 0, 0, 0)
  return d
}

function daysFromNow(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + n)
  d.setHours(8, 0, 0, 0)
  return d
}

async function main() {
  console.log('🌊 Mulai seeding SI-Mliwis...\n')

  // Clear semua data
  await prisma.bookingFasilitas.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.suratMasuk.deleteMany()
  await prisma.suratKeluar.deleteMany()
  await prisma.kasMasuk.deleteMany()
  await prisma.kasKeluar.deleteMany()
  await prisma.pengunjung.deleteMany()
  await prisma.fasilitas.deleteMany()
  await prisma.programKerjaDokumentasi.deleteMany()
  await prisma.programKerja.deleteMany()
  await prisma.berita.deleteMany()
  await prisma.user.deleteMany()
  console.log('  ✓ Data lama dihapus')

  // 1. Users
  const adminHash = await bcrypt.hash('admin123', 10)
  const staffHash = await bcrypt.hash('staff123', 10)

  const admin = await prisma.user.create({
    data: { username: 'admin', password: adminHash, namaLengkap: 'Administrator', role: 'admin' },
  })
  const staff = await prisma.user.create({
    data: { username: 'staff1', password: staffHash, namaLengkap: 'Budi Santoso', role: 'staff' },
  })
  console.log('  ✓ 2 user dibuat (admin / staff1)')

  // 2. Fasilitas
  const fasilitasData = [
    { nama: 'Area Camping Ground', deskripsi: 'Merasakan sensasi berkemah di bawah rindangnya cemara udang dengan suara deburan ombak laut selatan yang menenangkan.' },
    { nama: 'Sewa Payung Pantai', deskripsi: 'Payung teduh di sepanjang pantai untuk menikmati keindahan laut lepas dengan nyaman tanpa khawatir kepanasan.' },
    { nama: 'Mushola Pantai', deskripsi: 'Fasilitas ibadah yang tenang, bersih, dan sejuk di sekitar kawasan wisata Pantai Mliwis.' },
    { nama: 'Pusat Aneka Kuliner', deskripsi: 'Kawasan kuliner yang menjajakan makanan laut segar dan hidangan tradisional khas pesisir Ambal Kebumen.' },
    { nama: 'Pendopo / Aula Terbuka', deskripsi: 'Pendopo tradisional berkapasitas besar dengan sirkulasi udara pantai alami untuk acara formal maupun non-formal.' },
    { nama: 'Sewa Tikar Piknik', deskripsi: 'Tikar piknik praktis untuk berkumpul dan makan bersama keluarga di bawah naungan pohon cemara.' },
    { nama: 'Sewa Kuda Pantai', deskripsi: 'Menyusuri keindahan garis pantai selatan dengan menunggangi kuda yang dipandu pawang berpengalaman.' },
    { nama: 'Gazebo Pantai', deskripsi: 'Pondok kayu santai menghadap ke arah laut selatan untuk berkumpul bersama keluarga.' },
    { nama: 'Sewa & Area Ayunan', deskripsi: 'Fasilitas ayunan gantung di bawah pepohonan cemara yang teduh, sangat disukai oleh anak-anak.' },
    { nama: 'Parkir Luas (Jasa Penitipan)', deskripsi: 'Fasilitas area penitipan kendaraan yang sangat luas dan aman yang dikelola secara profesional.' },
    { nama: 'Kolam Renang Anak', deskripsi: 'Kolam renang air tawar mini yang aman dan menyenangkan untuk anak-anak bermain air.' },
    { nama: 'Sewa ATV Pantai', deskripsi: 'Petualangan seru mengendarai motor ATV menyusuri hamparan pasir hitam selatan yang menantang.' },
    { nama: 'Hutan Cemara yang Sejuk', deskripsi: 'Kawasan hutan cemara udang yang rimbun, menyajikan keteduhan alami di sepanjang pesisir pantai.' },
  ]
  const fasilitas = await Promise.all(
    fasilitasData.map((f) => prisma.fasilitas.create({ data: f }))
  )
  console.log('  ✓ 13 fasilitas dibuat')

  // 3. Surat Masuk
  const suratMasukData = [
    { nomorSurat: 'SM/001/V/2026', tanggalSurat: daysAgo(45), pengirim: 'Dinas Pariwisata Kebumen', tujuan: 'Pengelola Pantai Mliwis', perihal: 'Undangan Rapat Koordinasi Pariwisata' },
    { nomorSurat: 'SM/002/V/2026', tanggalSurat: daysAgo(38), pengirim: 'Pemerintah Desa Mirit', tujuan: 'Pengelola Pantai Mliwis', perihal: 'Pemberitahuan Kegiatan Gotong Royong' },
    { nomorSurat: 'SM/003/V/2026', tanggalSurat: daysAgo(25), pengirim: 'PT. Telkom Indonesia', tujuan: 'Pengelola Pantai Mliwis', perihal: 'Penawaran Kerjasama Internet WiFi' },
    { nomorSurat: 'SM/004/V/2026', tanggalSurat: daysAgo(15), pengirim: 'Badan Lingkungan Hidup', tujuan: 'Pengelola Pantai Mliwis', perihal: 'Himbauan Kebersihan Pantai' },
    { nomorSurat: 'SM/005/V/2026', tanggalSurat: daysAgo(5), pengirim: 'Karang Taruna Desa Mirit', tujuan: 'Pengelola Pantai Mliwis', perihal: 'Permohonan Penggunaan Area Outbound' },
  ]
  await Promise.all(
    suratMasukData.map((s) => prisma.suratMasuk.create({ data: { ...s, userId: admin.id } }))
  )
  console.log('  ✓ 5 surat masuk dibuat')

  // 4. Surat Keluar
  const suratKeluarData = [
    { nomorSurat: 'SK/001/V/2026', tanggalSurat: daysAgo(40), pengirim: 'Pengelola Pantai Mliwis', tujuan: 'Dinas Pariwisata Kebumen', perihal: 'Laporan Bulanan Pengelolaan Pantai' },
    { nomorSurat: 'SK/002/V/2026', tanggalSurat: daysAgo(30), pengirim: 'Pengelola Pantai Mliwis', tujuan: 'Pemerintah Desa Mirit', perihal: 'Permohonan Bantuan Infrastruktur Jalan' },
    { nomorSurat: 'SK/003/V/2026', tanggalSurat: daysAgo(10), pengirim: 'Pengelola Pantai Mliwis', tujuan: 'Bank BRI Cabang Kebumen', perihal: 'Pembukaan Rekening Operasional' },
  ]
  await Promise.all(
    suratKeluarData.map((s) => prisma.suratKeluar.create({ data: { ...s, userId: admin.id } }))
  )
  console.log('  ✓ 3 surat keluar dibuat')

  // 5. Booking
  const bookingData = [
    { kodeBooking: randomKode(), namaCustomer: 'Ahmad Fauzi', nomorHP: '081234567890', tanggalMulai: daysFromNow(7), tanggalSelesai: daysFromNow(8), jenisAcara: 'Camping Keluarga', status: 'menunggu', fasilitasIds: [fasilitas[0].id] },
    { kodeBooking: randomKode(), namaCustomer: 'Siti Rahayu', nomorHP: '082345678901', tanggalMulai: daysFromNow(14), tanggalSelesai: daysFromNow(14), jenisAcara: 'Foto Prewedding', status: 'menunggu', fasilitasIds: [fasilitas[12].id] },
    { kodeBooking: randomKode(), namaCustomer: 'PT. Maju Jaya', nomorHP: '083456789012', tanggalMulai: daysFromNow(21), tanggalSelesai: daysFromNow(22), jenisAcara: 'Outbound Karyawan', status: 'menunggu', fasilitasIds: [fasilitas[0].id, fasilitas[11].id] },
    { kodeBooking: randomKode(), namaCustomer: 'Dewi Kusuma', nomorHP: '084567890123', tanggalMulai: daysFromNow(3), tanggalSelesai: daysFromNow(3), jenisAcara: 'Acara Pernikahan', status: 'disetujui', catatanPengelola: 'Sudah dikonfirmasi. Silakan datang 1 jam sebelumnya.', fasilitasIds: [fasilitas[4].id] },
    { kodeBooking: randomKode(), namaCustomer: 'Komunitas Alam Bebas', nomorHP: '085678901234', tanggalMulai: daysFromNow(10), tanggalSelesai: daysFromNow(12), jenisAcara: 'Camping Komunitas', status: 'disetujui', catatanPengelola: 'Area camping sudah disiapkan.', fasilitasIds: [fasilitas[0].id, fasilitas[11].id] },
    { kodeBooking: randomKode(), namaCustomer: 'UMKM Kebumen Bersatu', nomorHP: '086789012345', tanggalMulai: daysFromNow(5), tanggalSelesai: daysFromNow(6), jenisAcara: 'Bazar UMKM', status: 'disetujui', catatanPengelola: 'Maksimal 20 stand.', fasilitasIds: [fasilitas[3].id] },
    { kodeBooking: randomKode(), namaCustomer: 'Rina Susanti', nomorHP: '087890123456', tanggalMulai: daysFromNow(2), tanggalSelesai: daysFromNow(2), jenisAcara: 'Pesta Ulang Tahun', status: 'ditolak', catatanPengelola: 'Maaf, tanggal sudah penuh.', fasilitasIds: [fasilitas[4].id] },
    { kodeBooking: randomKode(), namaCustomer: 'Sekolah SMP N 1 Mirit', nomorHP: '088901234567', tanggalMulai: daysFromNow(1), tanggalSelesai: daysFromNow(1), jenisAcara: 'Study Tour', status: 'ditolak', catatanPengelola: 'Jadwal bentrok dengan kegiatan lain.', fasilitasIds: [fasilitas[11].id, fasilitas[0].id] },
  ]

  for (const b of bookingData) {
    const { fasilitasIds, ...bookingFields } = b
    const booking = await prisma.booking.create({ data: bookingFields })
    await Promise.all(
      fasilitasIds.map((fid) =>
        prisma.bookingFasilitas.create({ data: { bookingId: booking.id, fasilitasId: fid } })
      )
    )
  }
  console.log('  ✓ 8 booking dibuat')

  // 6. Kas Masuk
  const kasMasukData = [
    { tanggal: daysAgo(28), jenisTransaksi: 'Tiket Masuk Wisata', nominal: 3500000, keterangan: 'Weekend pertama bulan' },
    { tanggal: daysAgo(25), jenisTransaksi: 'Sewa Gazebo/Tempat Duduk', nominal: 750000, keterangan: '5 unit gazebo' },
    { tanggal: daysAgo(22), jenisTransaksi: 'Tiket Masuk Wisata', nominal: 2800000, keterangan: 'Hari biasa' },
    { tanggal: daysAgo(20), jenisTransaksi: 'Sewa Camping Ground', nominal: 1200000, keterangan: 'Rombongan 3 tenda' },
    { tanggal: daysAgo(18), jenisTransaksi: 'Kerjasama Sponsorship', nominal: 5000000, keterangan: 'PT. Telkom - pemasangan banner' },
    { tanggal: daysAgo(15), jenisTransaksi: 'Tiket Masuk Wisata', nominal: 4200000, keterangan: 'Weekend + libur nasional' },
    { tanggal: daysAgo(12), jenisTransaksi: 'Sewa Gazebo/Tempat Duduk', nominal: 900000, keterangan: '6 unit gazebo' },
    { tanggal: daysAgo(10), jenisTransaksi: 'Tiket Masuk Wisata', nominal: 1800000, keterangan: 'Hari biasa' },
    { tanggal: daysAgo(7), jenisTransaksi: 'Tiket Masuk Wisata', nominal: 5100000, keterangan: 'Weekend long holiday' },
    { tanggal: daysAgo(5), jenisTransaksi: 'Sewa Camping Ground', nominal: 2400000, keterangan: 'Rombongan besar 8 tenda' },
    { tanggal: daysAgo(4), jenisTransaksi: 'Pendapatan Lain-lain', nominal: 500000, keteranganLain: 'Sewa spot foto', keterangan: 'Pembayaran spot foto instagramable' },
    { tanggal: daysAgo(3), jenisTransaksi: 'Tiket Masuk Wisata', nominal: 3200000, keterangan: 'Minggu ramai' },
    { tanggal: daysAgo(2), jenisTransaksi: 'Sewa Gazebo/Tempat Duduk', nominal: 600000, keterangan: '4 unit gazebo' },
    { tanggal: daysAgo(1), jenisTransaksi: 'Tiket Masuk Wisata', nominal: 2100000, keterangan: 'Hari biasa' },
    { tanggal: daysAgo(0), jenisTransaksi: 'Sewa Camping Ground', nominal: 1500000, keterangan: '4 tenda keluarga' },
  ]
  await Promise.all(
    kasMasukData.map((k) =>
      prisma.kasMasuk.create({ data: { ...k, nominal: k.nominal, userId: staff.id } })
    )
  )
  console.log('  ✓ 15 kas masuk dibuat')

  // 7. Kas Keluar
  const kasKeluarData = [
    { tanggal: daysAgo(27), jenisTransaksi: 'Gaji/Honor Pengelola', nominal: 8000000, keterangan: 'Gaji bulanan 4 orang pengelola' },
    { tanggal: daysAgo(24), jenisTransaksi: 'Kebersihan Pantai', nominal: 500000, keterangan: 'Alat kebersihan dan kantong sampah' },
    { tanggal: daysAgo(20), jenisTransaksi: 'Perawatan Fasilitas', nominal: 1200000, keterangan: 'Cat ulang gazebo dan pagar' },
    { tanggal: daysAgo(17), jenisTransaksi: 'Pembayaran Listrik', nominal: 850000, keterangan: 'Tagihan listrik bulan ini' },
    { tanggal: daysAgo(14), jenisTransaksi: 'Pembelian Peralatan', nominal: 2500000, keterangan: 'Tenda cadangan dan alat P3K' },
    { tanggal: daysAgo(10), jenisTransaksi: 'Konsumsi Kegiatan', nominal: 750000, keterangan: 'Konsumsi rapat koordinasi' },
    { tanggal: daysAgo(8), jenisTransaksi: 'Kebersihan Pantai', nominal: 300000, keterangan: 'Upah petugas kebersihan harian' },
    { tanggal: daysAgo(5), jenisTransaksi: 'Perawatan Fasilitas', nominal: 900000, keterangan: 'Perbaikan toilet umum' },
    { tanggal: daysAgo(3), jenisTransaksi: 'Pengeluaran Lain-lain', nominal: 450000, keteranganLain: 'Cetak brosur', keterangan: 'Cetak brosur promosi 1000 lembar' },
    { tanggal: daysAgo(1), jenisTransaksi: 'Pembelian Peralatan', nominal: 1800000, keterangan: 'Kursi pantai 10 unit' },
  ]
  await Promise.all(
    kasKeluarData.map((k) =>
      prisma.kasKeluar.create({ data: { ...k, nominal: k.nominal, userId: staff.id } })
    )
  )
  console.log('  ✓ 10 kas keluar dibuat')

  // 8. Pengunjung (30 hari terakhir)
  const pengunjungData = []
  for (let i = 29; i >= 0; i--) {
    const d = daysAgo(i)
    const dayOfWeek = d.getDay()
    // Weekend lebih ramai
    const base = dayOfWeek === 0 || dayOfWeek === 6 ? 250 : 100
    const total = base + Math.floor(Math.random() * 200)
    
    const jumlahBalita = Math.floor(total * 0.1)
    const jumlahAnak = Math.floor(total * 0.3)
    const jumlahDewasa = total - jumlahBalita - jumlahAnak
    
    pengunjungData.push({ 
      tanggal: d, 
      jumlahBalita, 
      jumlahAnak, 
      jumlahDewasa, 
      jumlah: total, 
      userId: staff.id 
    })
  }
  await Promise.all(
    pengunjungData.map((p) => prisma.pengunjung.create({ data: p }))
  )
  console.log('  ✓ 30 data pengunjung dibuat')

  // 9. Berita (Kabar & Kegiatan)
  const beritaData = [
    {
      judul: 'Festival Budaya Grebeg Rolasan Tarik Perhatian Ribuan Pengunjung',
      slug: 'festival-budaya-grebeg-rolasan-tarik-perhatian-ribuan-pengunjung',
      ringkasan: 'Arak-arakan gunungan hasil bumi raksasa menyusuri pesisir selatan sebagai bentuk rasa syukur warga Desa Kenoyojayan atas berkah melimpah.',
      gambarUtama: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600',
      kategori: 'Budaya & Tradisi',
      penulis: 'Admin Pokdarwis',
      published: true,
      konten: [
        { type: 'text', value: 'Arak-arakan gunungan hasil bumi raksasa menyusuri pesisir selatan Pantai Mliwis Kebumen sebagai bentuk rasa syukur warga Desa Kenoyojayan atas berkah melimpah yang mereka terima sepanjang tahun.' },
        { type: 'text', value: 'Ribuan pengunjung memadati lokasi festival sejak pagi hari untuk menyaksikan keunikan tradisi Grebeg Rolasan ini. Warga setempat menghias gunungan dengan berbagai sayuran, buah-buahan, serta aneka makanan tradisional.' }
      ]
    },
    {
      judul: 'Aksi Peduli Lingkungan: Penanaman 1.000 Pohon Cemara Udang',
      slug: 'aksi-peduli-lingkungan-penanaman-1-000-pohon-cemara-udang',
      ringkasan: 'Bekerja sama dengan Karang Taruna, Pokdarwis menanam seribu bibit cemara udang baru guna memperluas area teduh di Pantai Mliwis.',
      gambarUtama: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600',
      kategori: 'Lingkungan',
      penulis: 'Pengelola Lingkungan',
      published: true,
      konten: [
        { type: 'text', value: 'Bekerja sama dengan Karang Taruna Desa Kenoyojayan, Pokdarwis Pantai Mliwis melakukan aksi penanaman seribu bibit pohon cemara udang baru.' },
        { type: 'text', value: 'Kegiatan ini bertujuan untuk mencegah abrasi air laut samudra hindia serta memperluas kawasan teduh yang menjadi daya tarik utama bagi para wisatawan.' }
      ]
    },
    {
      judul: 'Wahana Baru Kolam Renang Anak & Penyewaan ATV Resmi Dibuka',
      slug: 'wahana-baru-kolam-renang-anak-penyewaan-atv-resmi-dibuka',
      ringkasan: 'Meningkatkan kenyamanan liburan keluarga, fasilitas kolam renang air tawar mini serta 10 unit motor ATV siap memanjakan para pengunjung.',
      gambarUtama: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=600',
      kategori: 'Wahana Wisata',
      penulis: 'Humas Mliwis',
      published: true,
      konten: [
        { type: 'text', value: 'Guna meningkatkan kepuasan pengunjung, pengelola Pantai Mliwis secara resmi membuka wahana baru berupa kolam renang air tawar anak-anak.' },
        { type: 'text', value: 'Selain itu, tersedia pula 10 unit motor ATV tangguh yang siap disewa untuk menyusuri hamparan pasir hitam luas khas pantai selatan Kebumen.' }
      ]
    },
    {
      judul: 'Sukses Gelar Outbound Corporate BUMN di Area Hutan Cemara',
      slug: 'sukses-gelar-outbound-corporate-bumn-di-area-hutan-cemara',
      ringkasan: 'Lebih dari 100 peserta mengikuti kegiatan team-building dan rapat koordinasi di Aula Terbuka Pendopo Mliwis dengan sirkulasi udara pesisir yang segar.',
      gambarUtama: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600',
      kategori: 'Kegiatan Acara',
      penulis: 'Admin Booking',
      published: true,
      konten: [
        { type: 'text', value: 'Area Hutan Cemara Pantai Mliwis kembali menjadi pilihan utama untuk acara corporate gathering berskala besar.' },
        { type: 'text', value: 'Kali ini, salah satu instansi BUMN mengadakan program team building (outbound) dan rapat koordinasi di kawasan Pendopo / Aula Terbuka Pantai Mliwis.' }
      ]
    }
  ]

  await Promise.all(
    beritaData.map((b) => prisma.berita.create({ data: { ...b, userId: admin.id } }))
  )
  console.log('  ✓ 4 berita kegiatan dibuat')

  console.log('\n🏖️  Seeding selesai!\n')
  console.log('  Akun tersedia:')
  console.log('  ┌─────────────┬──────────┬──────────┐')
  console.log('  │ Username    │ Password │ Role     │')
  console.log('  ├─────────────┼──────────┼──────────┤')
  console.log('  │ admin       │ admin123 │ admin    │')
  console.log('  │ staff1      │ staff123 │ staff    │')
  console.log('  └─────────────┴──────────┴──────────┘')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

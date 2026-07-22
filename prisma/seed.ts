// SI-Mliwis — Clean Database Seed for Production
// Jalankan: npx tsx prisma/seed.ts

import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌊 Mulai seeding SI-Mliwis (Bersih)...\n')

  // Clear semua data lama
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
  console.log('  ✓ Data lama berhasil dibersihkan')

  // 1. Buat 2 Akun Pengelola Utama
  const adminHash = await bcrypt.hash('admin123', 10)
  const staffHash = await bcrypt.hash('staff123', 10)

  await prisma.user.create({
    data: { username: 'admin', password: adminHash, namaLengkap: 'Administrator', role: 'admin' },
  })
  await prisma.user.create({
    data: { username: 'staff1', password: staffHash, namaLengkap: 'Staff Pokdarwis', role: 'staff' },
  })
  console.log('  ✓ 2 Akun Pengelola dibuat (admin / staff1)')

  // 2. Buat 13 Daftar Fasilitas Riil Pantai Mliwis
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
  
  await Promise.all(
    fasilitasData.map((f) => prisma.fasilitas.create({ data: f }))
  )
  console.log('  ✓ 13 Fasilitas riil dibuat')

  console.log('\n🏖️ Database Neon Postgres bersih & siap 100% untuk penggunaan riil!\n')
  console.log('  Akun Pengelola Resmi:')
  console.log('  ┌─────────────┬──────────┬──────────┐')
  console.log('  │ Username    │ Password │ Role     │')
  console.log('  ├─────────────┼──────────┼──────────┤')
  console.log('  │ admin       │ admin123 │ admin    │')
  console.log('  │ staff1      │ staff123 │ staff    │')
  console.log('  └─────────────┴──────────┴──────────┘\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

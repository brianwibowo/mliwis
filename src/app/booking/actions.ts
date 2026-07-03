'use server'

import { prisma } from '@/lib/prisma'
import { generateKodeBooking } from '@/lib/format'
import { logAudit } from '@/lib/audit'
import { put } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

export async function createBooking(formData: FormData) {
  try {
    const namaCustomer = formData.get('namaCustomer') as string
    const nomorHP = formData.get('nomorHP') as string
    const tanggalMulai = formData.get('tanggalMulai') as string
    const tanggalSelesai = formData.get('tanggalSelesai') as string
    const jenisAcara = formData.get('jenisAcara') as string
    const fasilitasIds = formData.getAll('fasilitas').map(Number)

    if (!namaCustomer || !nomorHP || !tanggalMulai || !tanggalSelesai || !jenisAcara || fasilitasIds.length === 0) {
      return { error: 'Semua field wajib diisi dan pilih minimal 1 fasilitas' }
    }

    // 1. Backend Input Validation
    if (!/^[a-zA-Z\s]{3,50}$/.test(namaCustomer.trim())) {
      return { error: 'Nama pemohon harus berupa huruf dan memiliki panjang 3 hingga 50 karakter' }
    }
    if (!/^[0-9]{10,14}$/.test(nomorHP.trim())) {
      return { error: 'Nomor HP harus berupa angka dan memiliki panjang 10 hingga 14 digit' }
    }
    if (jenisAcara.trim().length < 5) {
      return { error: 'Deskripsi kegiatan/acara minimal 5 karakter' }
    }

    const startObj = new Date(tanggalMulai)
    const endObj = new Date(tanggalSelesai)

    if (startObj > endObj) {
      return { error: 'Tanggal selesai harus sama atau setelah tanggal mulai' }
    }

    // 2. Double Booking Check (Irisan Tanggal pada Fasilitas yang Sama untuk Booking yang Disetujui)
    const overlapBooking = await prisma.booking.findFirst({
      where: {
        status: 'disetujui',
        tanggalMulai: { lte: endObj },
        tanggalSelesai: { gte: startObj },
        bookingFasilitas: {
          some: {
            fasilitasId: { in: fasilitasIds }
          }
        }
      },
      include: {
        bookingFasilitas: {
          include: {
            fasilitas: true
          }
        }
      }
    })

    if (overlapBooking) {
      const facilitiesNames = overlapBooking.bookingFasilitas
        .filter((bf) => fasilitasIds.includes(bf.fasilitasId))
        .map((bf) => bf.fasilitas.nama)
        .join(', ')
      return { 
        error: `Fasilitas "${facilitiesNames}" sudah dibooking dan disetujui untuk rentang tanggal tersebut. Silakan pilih tanggal atau fasilitas lainnya.` 
      }
    }

    const kodeBooking = generateKodeBooking()

    const booking = await prisma.booking.create({
      data: {
        kodeBooking,
        namaCustomer: namaCustomer.trim(),
        nomorHP: nomorHP.trim(),
        tanggalMulai: startObj,
        tanggalSelesai: endObj,
        jenisAcara: jenisAcara.trim(),
        status: 'menunggu'
      },
    })

    await Promise.all(
      fasilitasIds.map((fid) =>
        prisma.bookingFasilitas.create({
          data: { bookingId: booking.id, fasilitasId: fid }
        })
      )
    )

    // 3. Log Audit
    await logAudit('CREATE_BOOKING', `Booking baru diajukan oleh ${namaCustomer} (Kode: ${kodeBooking})`)

    return { success: true, kodeBooking }
  } catch (err: any) {
    console.error("Error creating booking:", err)
    return { error: 'Gagal memproses booking. Pastikan database Anda terhubung.' }
  }
}

export async function checkBookingStatus(kodeBooking: string) {
  try {
    if (!kodeBooking) return { error: 'Masukkan kode booking' }

    const booking = await prisma.booking.findUnique({
      where: { kodeBooking: kodeBooking.trim().toUpperCase() },
      include: { bookingFasilitas: { include: { fasilitas: true } } },
    })

    if (!booking) return { error: 'Kode booking tidak ditemukan' }

    return {
      data: {
        kodeBooking: booking.kodeBooking,
        namaCustomer: booking.namaCustomer,
        nomorHP: booking.nomorHP,
        jenisAcara: booking.jenisAcara,
        status: booking.status,
        statusPembayaran: booking.statusPembayaran,
        buktiPembayaran: booking.buktiPembayaran,
        tanggalMulai: booking.tanggalMulai.toISOString(),
        tanggalSelesai: booking.tanggalSelesai.toISOString(),
        catatanPengelola: booking.catatanPengelola,
        fasilitas: booking.bookingFasilitas.map((bf) => bf.fasilitas.nama),
      },
    }
  } catch (err: any) {
    console.error("Error checking booking status:", err)
    return { error: 'Gagal menghubungi database. Pastikan koneksi database aktif.' }
  }
}

export async function uploadBuktiPembayaranAction(kodeBooking: string, formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) return { error: 'File bukti pembayaran tidak ditemukan' }

    const fileExt = file.name.split('.').pop()?.toLowerCase()
    const isAllowedExt = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt || '')
    if (!isAllowedExt) {
      return { error: 'Format file tidak didukung. Harap unggah file gambar (JPG, JPEG, PNG, WEBP)' }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { error: 'Ukuran file terlalu besar. Maksimal 5MB.' }
    }

    let filePath = ''
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`bukti-pembayaran/${kodeBooking}-${Date.now()}.${fileExt}`, file, {
          access: 'public',
          addRandomSuffix: true
        })
        filePath = blob.url
      } catch (blobErr) {
        console.error("Vercel Blob failed, falling back to local file upload:", blobErr)
      }
    }

    if (!filePath) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      const fileName = `bukti-${kodeBooking}-${Date.now()}.${fileExt}`
      const targetPath = path.join(uploadDir, fileName)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      fs.writeFileSync(targetPath, buffer)
      filePath = `/uploads/${fileName}`
    }

    await prisma.booking.update({
      where: { kodeBooking },
      data: {
        buktiPembayaran: filePath
      }
    })

    return { success: true, filePath }
  } catch (err: any) {
    console.error("Error uploading payment proof:", err)
    return { error: 'Gagal mengunggah bukti pembayaran. Silakan coba kembali.' }
  }
}

export async function getFasilitas() {
  try {
    const data = await prisma.fasilitas.findMany({ orderBy: { nama: 'asc' } })
    return data.map((f) => ({ id: f.id, nama: f.nama, deskripsi: f.deskripsi }))
  } catch (err: any) {
    console.error("Error getting fasilitas:", err)
    return [
      { id: 1, nama: 'Area Camping Ground', deskripsi: 'Merasakan sensasi berkemah di bawah rindangnya cemara udang' },
      { id: 2, nama: 'Sewa Payung Pantai', deskripsi: 'Payung teduh di sepanjang pantai untuk menikmati keindahan laut lepas' },
      { id: 3, nama: 'Mushola Pantai', deskripsi: 'Fasilitas ibadah yang tenang, bersih, dan sejuk' },
      { id: 4, nama: 'Pusat Aneka Kuliner', deskripsi: 'Kawasan kuliner yang menjajakan makanan laut segar dan hidangan tradisional' },
      { id: 5, nama: 'Pendopo / Aula Terbuka', deskripsi: 'Pendopo tradisional berkapasitas besar dengan sirkulasi udara pantai alami' },
      { id: 6, nama: 'Sewa Tikar Piknik', deskripsi: 'Tikar piknik praktis untuk berkumpul dan makan bersama keluarga' },
      { id: 7, nama: 'Sewa Kuda Pantai', deskripsi: 'Menyusuri keindahan garis pantai selatan dengan menunggangi kuda' },
      { id: 8, nama: 'Gazebo Pantai', deskripsi: 'Pondok kayu santai menghadap ke arah laut selatan' },
      { id: 9, nama: 'Sewa & Area Ayunan', deskripsi: 'Fasilitas ayunan gantung di bawah pepohonan cemara yang teduh' },
      { id: 10, nama: 'Parkir Luas (Jasa Penitipan)', deskripsi: 'Fasilitas area penitipan kendaraan yang sangat luas dan aman' },
      { id: 11, nama: 'Kolam Renang Anak', deskripsi: 'Kolam renang air tawar mini yang aman dan menyenangkan' },
      { id: 12, nama: 'Sewa ATV Pantai', deskripsi: 'Petualangan seru mengendarai motor ATV menyusuri hamparan pasir' },
      { id: 13, nama: 'Hutan Cemara yang Sejuk', deskripsi: 'Kawasan hutan cemara udang yang rimbun, menyajikan keteduhan alami' }
    ]
  }
}

export async function getApprovedBookings() {
  try {
    const data = await prisma.booking.findMany({
      where: {
        status: 'disetujui'
      },
      include: {
        bookingFasilitas: {
          include: {
            fasilitas: true
          }
        }
      },
      orderBy: {
        tanggalMulai: 'asc'
      }
    })

    return {
      data: data.map((b) => ({
        id: b.id,
        kodeBooking: b.kodeBooking,
        namaCustomer: b.namaCustomer,
        nomorHP: b.nomorHP,
        jenisAcara: b.jenisAcara,
        status: b.status,
        statusPembayaran: b.statusPembayaran,
        buktiPembayaran: b.buktiPembayaran,
        tanggalMulai: b.tanggalMulai.toISOString(),
        tanggalSelesai: b.tanggalSelesai.toISOString(),
        catatanPengelola: b.catatanPengelola,
        fasilitas: b.bookingFasilitas.map((bf) => bf.fasilitas.nama),
      }))
    }
  } catch (err: any) {
    console.error("Error getting approved bookings:", err)
    return { error: 'Gagal mendapatkan data booking dari database.' }
  }
}



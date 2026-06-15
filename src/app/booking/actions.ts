'use server'

import { prisma } from '@/lib/prisma'
import { generateKodeBooking } from '@/lib/format'

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

    if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
      return { error: 'Tanggal selesai harus sama atau setelah tanggal mulai' }
    }

    const kodeBooking = generateKodeBooking()

    const booking = await prisma.booking.create({
      data: {
        kodeBooking,
        namaCustomer,
        nomorHP,
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        jenisAcara,
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
      where: { kodeBooking },
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

export async function getFasilitas() {
  try {
    const data = await prisma.fasilitas.findMany({ orderBy: { nama: 'asc' } })
    return data.map((f) => ({ id: f.id, nama: f.nama, deskripsi: f.deskripsi }))
  } catch (err: any) {
    console.error("Error getting fasilitas:", err)
    // Return a default mock set of facilities so the form doesn't crash if database is down
    return [
      { id: 1, nama: 'Area Camping Ground', deskripsi: 'Area berkemah' },
      { id: 2, nama: 'Sewa Payung Pantai', deskripsi: 'Payung teduh pantai' },
      { id: 3, nama: 'Mushola Pantai', deskripsi: 'Tempat ibadah' },
      { id: 4, nama: 'Area UMKM', deskripsi: 'Tempat jualan' },
      { id: 5, nama: 'Pendopo/Aula Terbuka', deskripsi: 'Aula serbaguna' },
      { id: 6, nama: 'Sewa Tikar Piknik', deskripsi: 'Tikar piknik' },
      { id: 7, nama: 'Sewa Kuda Pantai', deskripsi: 'Kuda sewa' },
      { id: 8, nama: 'Gazebo Pantai', deskripsi: 'Gazebo santai' },
      { id: 9, nama: 'Area Ayunan', deskripsi: 'Ayunan bermain' },
      { id: 10, nama: 'Kolam Renang Anak', deskripsi: 'Kolam renang anak' },
      { id: 11, nama: 'Sewa ATV Pantai', deskripsi: 'Motor ATV' },
      { id: 12, nama: 'Area Outbound', deskripsi: 'Area permainan' },
      { id: 13, nama: 'Area Prewedding', deskripsi: 'Spot foto prewedding' }
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


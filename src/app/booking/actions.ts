'use server'

import { prisma } from '@/lib/prisma'
import { generateKodeBooking } from '@/lib/format'

export async function createBooking(formData: FormData) {
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
    data: { kodeBooking, namaCustomer, nomorHP, tanggalMulai: new Date(tanggalMulai), tanggalSelesai: new Date(tanggalSelesai), jenisAcara, status: 'menunggu' },
  })

  await Promise.all(
    fasilitasIds.map((fid) => prisma.bookingFasilitas.create({ data: { bookingId: booking.id, fasilitasId: fid } }))
  )

  return { success: true, kodeBooking }
}

export async function checkBookingStatus(kodeBooking: string) {
  if (!kodeBooking) return { error: 'Masukkan kode booking' }

  const booking = await prisma.booking.findUnique({
    where: { kodeBooking },
    include: { bookingFasilitas: { include: { fasilitas: true } } },
  })

  if (!booking) return { error: 'Kode booking tidak ditemukan' }

  return {
    data: {
      kodeBooking: booking.kodeBooking, namaCustomer: booking.namaCustomer, nomorHP: booking.nomorHP,
      jenisAcara: booking.jenisAcara, status: booking.status,
      tanggalMulai: booking.tanggalMulai.toISOString(), tanggalSelesai: booking.tanggalSelesai.toISOString(),
      catatanPengelola: booking.catatanPengelola,
      fasilitas: booking.bookingFasilitas.map((bf) => bf.fasilitas.nama),
    },
  }
}

export async function getFasilitas() {
  const data = await prisma.fasilitas.findMany({ orderBy: { nama: 'asc' } })
  return data.map((f) => ({ id: f.id, nama: f.nama, deskripsi: f.deskripsi }))
}

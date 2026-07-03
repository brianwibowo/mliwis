'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

export async function getBookings(search?: string, status?: string, page = 1, perPage = 10) {
  const where: Record<string, unknown> = {}
  if (status && status !== 'semua') where.status = status
  if (search) {
    where.OR = [
      { kodeBooking: { contains: search } },
      { namaCustomer: { contains: search } },
      { jenisAcara: { contains: search } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * perPage, take: perPage,
      include: { bookingFasilitas: { include: { fasilitas: true } } },
    }),
    prisma.booking.count({ where }),
  ])

  return {
    data: data.map((b) => ({
      id: b.id, kodeBooking: b.kodeBooking, namaCustomer: b.namaCustomer, nomorHP: b.nomorHP,
      jenisAcara: b.jenisAcara, status: b.status,
      statusPembayaran: b.statusPembayaran,
      buktiPembayaran: b.buktiPembayaran,
      tanggalMulai: b.tanggalMulai.toISOString(), tanggalSelesai: b.tanggalSelesai.toISOString(),
      catatanPengelola: b.catatanPengelola,
      fasilitas: b.bookingFasilitas.map((bf) => bf.fasilitas.nama),
      createdAt: b.createdAt.toISOString(),
    })),
    total, totalPages: Math.ceil(total / perPage),
  }
}

export async function validateBooking(id: number, status: 'disetujui' | 'ditolak', catatan: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  if (status === 'disetujui') {
    const currentBooking = await prisma.booking.findUnique({
      where: { id },
      include: { bookingFasilitas: true }
    })

    if (!currentBooking) return { error: 'Data booking tidak ditemukan' }

    const fasilitasIds = currentBooking.bookingFasilitas.map(bf => bf.fasilitasId)

    const overlapBooking = await prisma.booking.findFirst({
      where: {
        id: { not: id },
        status: 'disetujui',
        tanggalMulai: { lte: currentBooking.tanggalSelesai },
        tanggalSelesai: { gte: currentBooking.tanggalMulai },
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
        error: `Gagal menyetujui. Fasilitas "${facilitiesNames}" sudah disewa oleh booking lain (${overlapBooking.kodeBooking}) pada rentang tanggal tersebut.` 
      }
    }
  }

  const booking = await prisma.booking.update({ 
    where: { id }, 
    data: { status, catatanPengelola: catatan || null } 
  })
  
  await logAudit('VALIDATE_BOOKING', `Booking ${booking.kodeBooking} divalidasi dengan status: ${status}`)
  
  revalidatePath('/booking-admin')
  revalidatePath('/booking-admin/validasi')
  return { success: true }
}

export async function updatePaymentStatus(id: number, statusPembayaran: string) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const booking = await prisma.booking.update({
    where: { id },
    data: { statusPembayaran }
  })

  await logAudit('UPDATE_PAYMENT_STATUS', `Status pembayaran Booking ${booking.kodeBooking} diubah menjadi ${statusPembayaran}`)
  revalidatePath('/booking-admin')
  return { success: true }
}

export async function deleteBooking(id: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const booking = await prisma.booking.findUnique({ where: { id } })
  const bookingKode = booking?.kodeBooking || String(id)

  await prisma.bookingFasilitas.deleteMany({ where: { bookingId: id } })
  await prisma.booking.delete({ where: { id } })
  
  await logAudit('DELETE_BOOKING', `Booking ${bookingKode} dihapus dari sistem`)
  
  revalidatePath('/booking-admin')
  return { success: true }
}


'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

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

  await prisma.booking.update({ where: { id }, data: { status, catatanPengelola: catatan || null } })
  revalidatePath('/booking-admin')
  revalidatePath('/booking-admin/validasi')
  return { success: true }
}

export async function deleteBooking(id: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  await prisma.bookingFasilitas.deleteMany({ where: { bookingId: id } })
  await prisma.booking.delete({ where: { id } })
  revalidatePath('/booking-admin')
  return { success: true }
}

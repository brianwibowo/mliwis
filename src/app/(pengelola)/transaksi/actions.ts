'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

// ==================== KAS MASUK ====================

export async function getKasMasuk(page = 1, perPage = 10, month?: number, year?: number) {
  const now = new Date()
  const m = month ?? now.getMonth() + 1
  const y = year ?? now.getFullYear()
  const start = new Date(y, m - 1, 1)
  const end = new Date(y, m, 0, 23, 59, 59)

  const where = { tanggal: { gte: start, lte: end } }

  const [data, total, agg] = await Promise.all([
    prisma.kasMasuk.findMany({ where, orderBy: { tanggal: 'desc' }, skip: (page - 1) * perPage, take: perPage, include: { user: { select: { namaLengkap: true } } } }),
    prisma.kasMasuk.count({ where }),
    prisma.kasMasuk.aggregate({ _sum: { nominal: true }, where }),
  ])

  return {
    data: data.map((k) => ({ ...k, tanggal: k.tanggal.toISOString(), nominal: Number(k.nominal), createdAt: k.createdAt.toISOString(), updatedAt: k.updatedAt.toISOString() })),
    total, totalPages: Math.ceil(total / perPage),
    totalNominal: Number(agg._sum.nominal || 0), month: m, year: y,
  }
}

export async function createKasMasuk(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const tanggal = formData.get('tanggal') as string
  const jenisTransaksi = formData.get('jenisTransaksi') as string
  const nominal = Number(formData.get('nominal'))
  const keterangan = formData.get('keterangan') as string
  const keteranganLain = formData.get('keteranganLain') as string

  if (!tanggal || !jenisTransaksi || !nominal) return { error: 'Field wajib belum lengkap' }

  await prisma.kasMasuk.create({
    data: { tanggal: new Date(tanggal), jenisTransaksi, nominal, keterangan: keterangan || null, keteranganLain: keteranganLain || null, userId: session.userId },
  })
  
  await logAudit('CREATE_KAS_MASUK', `Pemasukan baru ditambahkan: "${jenisTransaksi}" sebesar Rp${nominal.toLocaleString('id-ID')}`)
  
  revalidatePath('/transaksi/kas-masuk')
  return { success: true }
}

export async function updateKasMasuk(id: number, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const updated = await prisma.kasMasuk.update({
    where: { id },
    data: {
      tanggal: new Date(formData.get('tanggal') as string),
      jenisTransaksi: formData.get('jenisTransaksi') as string,
      nominal: Number(formData.get('nominal')),
      keterangan: (formData.get('keterangan') as string) || null,
      keteranganLain: (formData.get('keteranganLain') as string) || null,
    },
  })
  
  await logAudit('UPDATE_KAS_MASUK', `Pemasukan ID ${id} diubah menjadi: "${updated.jenisTransaksi}" sebesar Rp${Number(updated.nominal).toLocaleString('id-ID')}`)
  
  revalidatePath('/transaksi/kas-masuk')
  return { success: true }
}

export async function deleteKasMasuk(id: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }
  
  const old = await prisma.kasMasuk.findUnique({ where: { id } })
  await prisma.kasMasuk.delete({ where: { id } })
  
  if (old) {
    await logAudit('DELETE_KAS_MASUK', `Pemasukan ID ${id} ("${old.jenisTransaksi}") senilai Rp${Number(old.nominal).toLocaleString('id-ID')} dihapus`)
  }
  
  revalidatePath('/transaksi/kas-masuk')
  return { success: true }
}

// ==================== KAS KELUAR ====================

export async function getKasKeluar(page = 1, perPage = 10, month?: number, year?: number) {
  const now = new Date()
  const m = month ?? now.getMonth() + 1
  const y = year ?? now.getFullYear()
  const start = new Date(y, m - 1, 1)
  const end = new Date(y, m, 0, 23, 59, 59)

  const where = { tanggal: { gte: start, lte: end } }

  const [data, total, agg] = await Promise.all([
    prisma.kasKeluar.findMany({ where, orderBy: { tanggal: 'desc' }, skip: (page - 1) * perPage, take: perPage, include: { user: { select: { namaLengkap: true } } } }),
    prisma.kasKeluar.count({ where }),
    prisma.kasKeluar.aggregate({ _sum: { nominal: true }, where }),
  ])

  return {
    data: data.map((k) => ({ ...k, tanggal: k.tanggal.toISOString(), nominal: Number(k.nominal), createdAt: k.createdAt.toISOString(), updatedAt: k.updatedAt.toISOString() })),
    total, totalPages: Math.ceil(total / perPage),
    totalNominal: Number(agg._sum.nominal || 0), month: m, year: y,
  }
}

export async function createKasKeluar(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const tanggal = formData.get('tanggal') as string
  const jenisTransaksi = formData.get('jenisTransaksi') as string
  const nominal = Number(formData.get('nominal'))
  const keterangan = formData.get('keterangan') as string
  const keteranganLain = formData.get('keteranganLain') as string

  if (!tanggal || !jenisTransaksi || !nominal) return { error: 'Field wajib belum lengkap' }

  await prisma.kasKeluar.create({
    data: { tanggal: new Date(tanggal), jenisTransaksi, nominal, keterangan: keterangan || null, keteranganLain: keteranganLain || null, userId: session.userId },
  })
  
  await logAudit('CREATE_KAS_KELUAR', `Pengeluaran baru ditambahkan: "${jenisTransaksi}" sebesar Rp${nominal.toLocaleString('id-ID')}`)
  
  revalidatePath('/transaksi/kas-keluar')
  return { success: true }
}

export async function updateKasKeluar(id: number, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const updated = await prisma.kasKeluar.update({
    where: { id },
    data: {
      tanggal: new Date(formData.get('tanggal') as string),
      jenisTransaksi: formData.get('jenisTransaksi') as string,
      nominal: Number(formData.get('nominal')),
      keterangan: (formData.get('keterangan') as string) || null,
      keteranganLain: (formData.get('keteranganLain') as string) || null,
    },
  })
  
  await logAudit('UPDATE_KAS_KELUAR', `Pengeluaran ID ${id} diubah menjadi: "${updated.jenisTransaksi}" sebesar Rp${Number(updated.nominal).toLocaleString('id-ID')}`)
  
  revalidatePath('/transaksi/kas-keluar')
  return { success: true }
}

export async function deleteKasKeluar(id: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }
  
  const old = await prisma.kasKeluar.findUnique({ where: { id } })
  await prisma.kasKeluar.delete({ where: { id } })
  
  if (old) {
    await logAudit('DELETE_KAS_KELUAR', `Pengeluaran ID ${id} ("${old.jenisTransaksi}") senilai Rp${Number(old.nominal).toLocaleString('id-ID')} dihapus`)
  }
  
  revalidatePath('/transaksi/kas-keluar')
  return { success: true }
}

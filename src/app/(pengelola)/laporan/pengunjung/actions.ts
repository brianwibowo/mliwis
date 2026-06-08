'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function getPengunjung(month?: number, year?: number) {
  const now = new Date()
  const m = month ?? now.getMonth() + 1
  const y = year ?? now.getFullYear()
  const start = new Date(y, m - 1, 1)
  const end = new Date(y, m, 0, 23, 59, 59)

  const [data, agg] = await Promise.all([
    prisma.pengunjung.findMany({ 
      where: { tanggal: { gte: start, lte: end } }, 
      orderBy: { tanggal: 'desc' } 
    }),
    prisma.pengunjung.aggregate({ 
      _sum: { 
        jumlah: true,
        jumlahBalita: true,
        jumlahAnak: true,
        jumlahDewasa: true
      }, 
      where: { tanggal: { gte: start, lte: end } } 
    }),
  ])

  const totalDays = data.length || 1
  return {
    data: data.map((p) => ({ 
      id: p.id, 
      tanggal: p.tanggal.toISOString(), 
      jumlahBalita: p.jumlahBalita,
      jumlahAnak: p.jumlahAnak,
      jumlahDewasa: p.jumlahDewasa,
      jumlah: p.jumlah 
    })),
    total: Number(agg._sum.jumlah || 0),
    totalBalita: Number(agg._sum.jumlahBalita || 0),
    totalAnak: Number(agg._sum.jumlahAnak || 0),
    totalDewasa: Number(agg._sum.jumlahDewasa || 0),
    rataRata: Math.round(Number(agg._sum.jumlah || 0) / totalDays),
    month: m, 
    year: y,
  }
}

export async function createPengunjung(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }
  
  const tanggal = formData.get('tanggal') as string
  const jumlahBalita = Number(formData.get('jumlahBalita') || 0)
  const jumlahAnak = Number(formData.get('jumlahAnak') || 0)
  const jumlahDewasa = Number(formData.get('jumlahDewasa') || 0)
  
  const jumlah = jumlahBalita + jumlahAnak + jumlahDewasa

  if (!tanggal) return { error: 'Tanggal wajib diisi' }
  if (jumlah <= 0) return { error: 'Total jumlah pengunjung harus lebih dari 0' }

  const existing = await prisma.pengunjung.findFirst({ where: { tanggal: new Date(tanggal) } })
  
  if (existing) {
    await prisma.pengunjung.update({ 
      where: { id: existing.id }, 
      data: { jumlahBalita, jumlahAnak, jumlahDewasa, jumlah } 
    })
  } else {
    await prisma.pengunjung.create({ 
      data: { 
        tanggal: new Date(tanggal), 
        jumlahBalita, 
        jumlahAnak, 
        jumlahDewasa, 
        jumlah, 
        userId: session.userId 
      } 
    })
  }
  revalidatePath('/laporan/pengunjung')
  return { success: true }
}

export async function updatePengunjung(id: number, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }
  
  const jumlahBalita = Number(formData.get('jumlahBalita') || 0)
  const jumlahAnak = Number(formData.get('jumlahAnak') || 0)
  const jumlahDewasa = Number(formData.get('jumlahDewasa') || 0)
  
  const jumlah = jumlahBalita + jumlahAnak + jumlahDewasa

  if (jumlah <= 0) return { error: 'Total jumlah pengunjung harus lebih dari 0' }

  await prisma.pengunjung.update({ 
    where: { id }, 
    data: { jumlahBalita, jumlahAnak, jumlahDewasa, jumlah } 
  })
  
  revalidatePath('/laporan/pengunjung')
  return { success: true }
}

export async function deletePengunjung(id: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }
  
  await prisma.pengunjung.delete({ where: { id } })
  revalidatePath('/laporan/pengunjung')
  return { success: true }
}

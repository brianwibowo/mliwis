'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function getLaporanData(type: 'mingguan' | 'bulanan', month?: number, year?: number, week?: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const now = new Date()
  const m = month ?? now.getMonth() + 1
  const y = year ?? now.getFullYear()

  let start: Date, end: Date, period: string
  const bulanNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

  if (type === 'mingguan' && week) {
    const firstDay = new Date(y, m - 1, 1)
    start = new Date(y, m - 1, (week - 1) * 7 + 1)
    end = new Date(y, m - 1, Math.min(week * 7, new Date(y, m, 0).getDate()), 23, 59, 59)
    period = `Minggu ke-${week}, ${bulanNames[m - 1]} ${y}`
  } else {
    start = new Date(y, m - 1, 1)
    end = new Date(y, m, 0, 23, 59, 59)
    period = `${bulanNames[m - 1]} ${y}`
  }

  const where = { tanggal: { gte: start, lte: end } }

  const [kasMasukData, kasKeluarData, pengunjungAgg, bookingCount] = await Promise.all([
    prisma.kasMasuk.findMany({ where, orderBy: { tanggal: 'asc' } }),
    prisma.kasKeluar.findMany({ where, orderBy: { tanggal: 'asc' } }),
    prisma.pengunjung.aggregate({ _sum: { jumlah: true }, where }),
    prisma.booking.count({ where: { createdAt: { gte: start, lte: end } } }),
  ])

  const totalMasuk = kasMasukData.reduce((s, k) => s + Number(k.nominal), 0)
  const totalKeluar = kasKeluarData.reduce((s, k) => s + Number(k.nominal), 0)

  // Group by jenis transaksi
  const groupKasMasuk: Record<string, number> = {}
  kasMasukData.forEach((k) => { groupKasMasuk[k.jenisTransaksi] = (groupKasMasuk[k.jenisTransaksi] || 0) + Number(k.nominal) })

  const groupKasKeluar: Record<string, number> = {}
  kasKeluarData.forEach((k) => { groupKasKeluar[k.jenisTransaksi] = (groupKasKeluar[k.jenisTransaksi] || 0) + Number(k.nominal) })

  return {
    period, type, month: m, year: y, week,
    kasMasuk: { grouped: Object.entries(groupKasMasuk).map(([jenis, total]) => ({ jenis, total })), total: totalMasuk },
    kasKeluar: { grouped: Object.entries(groupKasKeluar).map(([jenis, total]) => ({ jenis, total })), total: totalKeluar },
    saldo: totalMasuk - totalKeluar,
    totalPengunjung: Number(pengunjungAgg._sum.jumlah || 0),
    totalBooking: bookingCount,
  }
}

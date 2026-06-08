export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - 6)
  startOfWeek.setHours(0, 0, 0, 0)

  // Parallel data fetching
  const [
    totalPengunjungBulanIni,
    totalKasMasukBulanIni,
    bookingMenunggu,
    recentBookings,
    pengunjung7Hari,
    kasMasuk6Bulan,
    bookingByStatus,
  ] = await Promise.all([
    // Total pengunjung bulan ini
    prisma.pengunjung.aggregate({
      _sum: { jumlah: true },
      where: { tanggal: { gte: startOfMonth } },
    }),
    // Total kas masuk bulan ini
    prisma.kasMasuk.aggregate({
      _sum: { nominal: true },
      where: { tanggal: { gte: startOfMonth } },
    }),
    // Booking menunggu
    prisma.booking.count({
      where: { status: 'menunggu' },
    }),

    // 5 booking terbaru
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        bookingFasilitas: {
          include: { fasilitas: true },
        },
      },
    }),
    // Pengunjung 7 hari terakhir
    prisma.pengunjung.findMany({
      where: { tanggal: { gte: startOfWeek } },
      orderBy: { tanggal: 'asc' },
    }),
    // Kas masuk per bulan (6 bulan terakhir) - fetch raw data
    prisma.kasMasuk.findMany({
      where: {
        tanggal: {
          gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
        },
      },
      select: { tanggal: true, nominal: true },
      orderBy: { tanggal: 'asc' },
    }),
    // Booking by status
    Promise.all([
      prisma.booking.count({ where: { status: 'menunggu' } }),
      prisma.booking.count({ where: { status: 'disetujui' } }),
      prisma.booking.count({ where: { status: 'ditolak' } }),
    ]),
  ])

  // Process kas masuk data into monthly aggregates
  const monthlyKasMasuk: { bulan: string; total: number }[] = []
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${d.getFullYear()}-${d.getMonth()}`
    const total = kasMasuk6Bulan
      .filter((k) => {
        const kd = new Date(k.tanggal)
        return kd.getFullYear() === d.getFullYear() && kd.getMonth() === d.getMonth()
      })
      .reduce((sum, k) => sum + Number(k.nominal), 0)
    monthlyKasMasuk.push({ bulan: monthNames[d.getMonth()], total })
  }

  // Serialize data for client component
  const dashboardData = {
    stats: {
      totalPengunjung: totalPengunjungBulanIni._sum.jumlah || 0,
      totalPendapatan: Number(totalKasMasukBulanIni._sum.nominal || 0),
      bookingMenunggu,
    },
    pengunjung7Hari: pengunjung7Hari.map((p) => ({
      tanggal: p.tanggal.toISOString(),
      jumlah: p.jumlah,
    })),
    monthlyKasMasuk,
    bookingByStatus: {
      menunggu: bookingByStatus[0],
      disetujui: bookingByStatus[1],
      ditolak: bookingByStatus[2],
    },
    recentBookings: recentBookings.map((b) => ({
      id: b.id,
      kodeBooking: b.kodeBooking,
      namaCustomer: b.namaCustomer,
      jenisAcara: b.jenisAcara,
      status: b.status,
      tanggalMulai: b.tanggalMulai.toISOString(),
      fasilitas: b.bookingFasilitas.map((bf) => bf.fasilitas.nama),
      createdAt: b.createdAt.toISOString(),
    })),
  }

  return <DashboardClient data={dashboardData} />
}

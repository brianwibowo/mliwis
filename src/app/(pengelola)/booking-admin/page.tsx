export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getBookings } from './actions'
import BookingAdminClient from './BookingAdminClient'

export const metadata = { title: 'Data Booking' }

export default async function BookingAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [result, totalBookingBulanIni] = await Promise.all([
    getBookings(params.search || '', params.status || '', Number(params.page) || 1),
    prisma.booking.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
  ])

  return (
    <BookingAdminClient
      initialData={result}
      currentSearch={params.search || ''}
      currentStatus={params.status || ''}
      currentPage={Number(params.page) || 1}
      totalBookingBulanIni={totalBookingBulanIni}
    />
  )
}

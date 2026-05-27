export const dynamic = 'force-dynamic'

import { getBookings } from './actions'
import BookingAdminClient from './BookingAdminClient'

export const metadata = { title: 'Data Booking' }

export default async function BookingAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  const result = await getBookings(params.search || '', params.status || '', Number(params.page) || 1)
  return <BookingAdminClient initialData={result} currentSearch={params.search || ''} currentStatus={params.status || ''} currentPage={Number(params.page) || 1} />
}

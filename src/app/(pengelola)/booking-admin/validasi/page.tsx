export const dynamic = 'force-dynamic'

import { getBookings } from '../actions'
import ValidasiClient from './ValidasiClient'

export const metadata = { title: 'Validasi Booking' }

export default async function ValidasiPage() {
  const result = await getBookings('', 'menunggu', 1, 50)
  return <ValidasiClient bookings={result.data} />
}

export const dynamic = 'force-dynamic'

import { getFasilitas } from './actions'
import BookingFormClient from './BookingFormClient'

export default async function BookingPage() {
  const fasilitas = await getFasilitas()
  return <BookingFormClient fasilitas={fasilitas} />
}

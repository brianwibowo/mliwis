export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getFasilitas } from './actions'
import BookingFormClient from './BookingFormClient'

export default async function BookingPage() {
  const fasilitas = await getFasilitas()
  
  return (
    <Suspense fallback={<div className="loading-page"><div className="spinner" /></div>}>
      <BookingFormClient fasilitas={fasilitas} />
    </Suspense>
  )
}

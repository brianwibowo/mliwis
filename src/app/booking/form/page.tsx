export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getFasilitas } from '../actions'
import BookingFormPage from './BookingFormPage'

export default async function BookingFormRoute() {
  const fasilitas = await getFasilitas()
  
  return (
    <Suspense fallback={<div className="loading-page"><div className="spinner" /></div>}>
      <BookingFormPage fasilitas={fasilitas} />
    </Suspense>
  )
}

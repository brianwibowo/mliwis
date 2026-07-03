export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getFasilitas } from './actions'
import BookingFormClient from './BookingFormClient'

function BookingSkeleton() {
  return (
    <div className="loading-page" style={{ maxWidth: '1200px', margin: '40px auto', padding: '24px' }}>
      <div className="skeleton" style={{ height: '40px', width: '250px', marginBottom: '24px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div className="skeleton-card" style={{ height: '180px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="skeleton" style={{ height: '24px', width: '150px' }} />
          <div className="skeleton-text" />
          <div className="skeleton-text" />
          <div className="skeleton-text short" />
        </div>
        <div className="skeleton-card" style={{ height: '180px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="skeleton" style={{ height: '24px', width: '150px' }} />
          <div className="skeleton-text" />
          <div className="skeleton-text" />
          <div className="skeleton-text short" />
        </div>
      </div>
      <div className="skeleton-card" style={{ height: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton" style={{ height: '32px', width: '200px' }} />
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="skeleton" style={{ height: '40px', width: '150px' }} />
          <div className="skeleton" style={{ height: '40px', width: '150px' }} />
        </div>
        <div className="skeleton" style={{ height: '200px', width: '100%', flex: 1 }} />
      </div>
    </div>
  )
}

export default async function BookingPage() {
  const fasilitas = await getFasilitas()
  
  return (
    <Suspense fallback={<BookingSkeleton />}>
      <BookingFormClient fasilitas={fasilitas} />
    </Suspense>
  )
}

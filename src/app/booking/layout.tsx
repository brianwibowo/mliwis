import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Booking Acara — Pantai Mliwis',
  description: 'Booking tempat acara di Pantai Mliwis, Kebumen. Camping, outbound, prewedding, dan lainnya.',
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

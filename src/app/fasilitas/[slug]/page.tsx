import { notFound } from 'next/navigation'
import { LIST_FASILITAS } from '@/lib/data-landing'
import FacilityDetailClient from './FacilityDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const item = LIST_FASILITAS.find((f) => f.slug === slug)
  if (!item) return { title: 'Fasilitas Tidak Ditemukan' }

  return {
    title: `${item.title} — Fasilitas Unggulan Pantai Mliwis`,
    description: item.description,
  }
}

export default async function FacilityDetailPage({ params }: Props) {
  const { slug } = await params
  const item = LIST_FASILITAS.find((f) => f.slug === slug)
  if (!item) notFound()

  return <FacilityDetailClient item={item} />
}

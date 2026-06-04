import { notFound } from 'next/navigation'
import { LIST_KULINER } from '@/lib/data-landing'
import CulinaryDetailClient from './CulinaryDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const item = LIST_KULINER.find((k) => k.slug === slug)
  if (!item) return { title: 'Kuliner Tidak Ditemukan' }

  return {
    title: `${item.title} — Kuliner Khas Pantai Mliwis`,
    description: item.description,
  }
}

export default async function CulinaryDetailPage({ params }: Props) {
  const { slug } = await params
  const item = LIST_KULINER.find((k) => k.slug === slug)
  if (!item) notFound()

  return <CulinaryDetailClient item={item} />
}

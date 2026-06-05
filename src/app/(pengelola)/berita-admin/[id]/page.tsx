import { notFound } from 'next/navigation'
import { getBeritaById } from '../actions'
import BeritaFormClient from '../BeritaFormClient'

export const metadata = { title: 'Formulir Berita' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function BeritaFormPage({ params }: Props) {
  const { id } = await params
  
  if (id === 'new') {
    return <BeritaFormClient initialBerita={null} />
  }

  const beritaId = Number(id)
  if (isNaN(beritaId)) {
    notFound()
  }

  const berita = await getBeritaById(beritaId)
  if (!berita) {
    notFound()
  }

  return <BeritaFormClient initialBerita={berita} />
}

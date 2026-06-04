export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getProgramKerjaById } from '../actions'
import DetailClient from './DetailClient'

export const metadata = { title: 'Detail Program Kerja' }

export default async function ProgramKerjaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getProgramKerjaById(Number(id))
  if (!data) notFound()
  return <DetailClient data={data} />
}

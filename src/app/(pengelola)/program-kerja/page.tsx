export const dynamic = 'force-dynamic'

import { getProgramKerja } from './actions'
import ProgramKerjaClient from './ProgramKerjaClient'

export const metadata = { title: 'Program Kerja Pokdarwis' }

export default async function ProgramKerjaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>
}) {
  const params = await searchParams
  const result = await getProgramKerja(
    params.search || undefined,
    params.status || undefined,
    Number(params.page) || 1,
  )
  return <ProgramKerjaClient initialData={result} initialSearch={params.search || ''} initialStatus={params.status || 'Semua'} />
}

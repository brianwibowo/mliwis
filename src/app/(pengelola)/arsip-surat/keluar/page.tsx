export const dynamic = 'force-dynamic'

import { getSuratKeluar } from '../actions'
import SuratKeluarClient from './SuratKeluarClient'

export const metadata = { title: 'Surat Keluar' }

export default async function SuratKeluarPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search || ''
  const page = Number(params.page) || 1
  const result = await getSuratKeluar(search, page)
  return <SuratKeluarClient initialData={result} currentSearch={search} currentPage={page} />
}

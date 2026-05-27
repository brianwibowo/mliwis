export const dynamic = 'force-dynamic'

import { getSuratMasuk } from '../actions'
import SuratMasukClient from './SuratMasukClient'

export const metadata = { title: 'Surat Masuk' }

export default async function SuratMasukPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>
}) {
  const params = await searchParams
  const search = params.search || ''
  const page = Number(params.page) || 1
  const result = await getSuratMasuk(search, page)
  return <SuratMasukClient initialData={result} currentSearch={search} currentPage={page} />
}

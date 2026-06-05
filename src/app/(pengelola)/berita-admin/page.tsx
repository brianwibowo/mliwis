export const dynamic = 'force-dynamic'

import { getBeritaAdmin } from './actions'
import BeritaAdminClient from './BeritaAdminClient'

export const metadata = { title: 'Manajemen Berita' }

export default async function BeritaAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>
}) {
  const params = await searchParams
  const result = await getBeritaAdmin(
    params.search || undefined,
    params.status || undefined, // maps to published state filter
    Number(params.page) || 1,
  )
  return (
    <BeritaAdminClient 
      initialData={result} 
      initialSearch={params.search || ''} 
      initialStatus={params.status || 'Semua'} 
    />
  )
}

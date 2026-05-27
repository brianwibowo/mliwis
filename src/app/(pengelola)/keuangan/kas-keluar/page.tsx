export const dynamic = 'force-dynamic'

import { getKasKeluar } from '../actions'
import KasKeluarClient from './KasKeluarClient'

export const metadata = { title: 'Kas Keluar' }

export default async function KasKeluarPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; month?: string; year?: string }>
}) {
  const params = await searchParams
  const result = await getKasKeluar(Number(params.page) || 1, 10, params.month ? Number(params.month) : undefined, params.year ? Number(params.year) : undefined)
  return <KasKeluarClient initialData={result} />
}

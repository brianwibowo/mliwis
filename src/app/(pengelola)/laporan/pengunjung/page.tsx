export const dynamic = 'force-dynamic'

import { getPengunjung } from './actions'
import PengunjungClient from './PengunjungClient'

export const metadata = { title: 'Laporan Pengunjung' }

export default async function PengunjungPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>
}) {
  const params = await searchParams
  const result = await getPengunjung(params.month ? Number(params.month) : undefined, params.year ? Number(params.year) : undefined)
  return <PengunjungClient initialData={result} />
}

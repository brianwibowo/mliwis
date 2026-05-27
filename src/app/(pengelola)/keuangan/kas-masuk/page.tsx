export const dynamic = 'force-dynamic'

import { getKasMasuk } from '../actions'
import KasMasukClient from './KasMasukClient'

export const metadata = { title: 'Kas Masuk' }

export default async function KasMasukPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; month?: string; year?: string }>
}) {
  const params = await searchParams
  const result = await getKasMasuk(Number(params.page) || 1, 10, params.month ? Number(params.month) : undefined, params.year ? Number(params.year) : undefined)
  return <KasMasukClient initialData={result} />
}

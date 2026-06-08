export const dynamic = 'force-dynamic'

import { getLaporanData } from './actions'
import LaporanClient from './LaporanClient'

export const metadata = { title: 'Laporan Transaksi' }

export default async function LaporanPage() {
  const result = await getLaporanData('bulanan')
  return <LaporanClient initialData={result && !('error' in result) ? result : null} />
}

export const dynamic = 'force-dynamic'

import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PusatInformasiClient from './PusatInformasiClient'

export const metadata = { title: 'Pusat Informasi' }

export default async function PusatInformasiPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return <PusatInformasiClient />
}

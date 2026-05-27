export const dynamic = 'force-dynamic'

import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUsers } from './actions'
import PengaturanClient from './PengaturanClient'

export const metadata = { title: 'Pengaturan' }

export default async function PengaturanPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const isAdmin = session.role === 'admin'
  let users: { id: number; username: string; namaLengkap: string; role: string; createdAt: string }[] = []

  if (isAdmin) {
    const result = await getUsers()
    if (result && 'data' in result && result.data) users = result.data
  }

  return <PengaturanClient isAdmin={isAdmin} users={users} currentUserId={session.userId} />
}

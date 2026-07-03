export const dynamic = 'force-dynamic'

import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUsers, getAuditLogs } from './actions'
import PengaturanClient from './PengaturanClient'

export const metadata = { title: 'Pengaturan' }

export default async function PengaturanPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const isAdmin = session.role === 'admin'
  let users: { id: number; username: string; namaLengkap: string; role: string; createdAt: string }[] = []
  let auditLogs: { id: number; username: string; action: string; target: string; createdAt: string }[] = []

  if (isAdmin) {
    const result = await getUsers()
    if (result && 'data' in result && result.data) users = result.data

    const logsResult = await getAuditLogs()
    if (logsResult && 'data' in logsResult && logsResult.data) auditLogs = logsResult.data
  }

  return <PengaturanClient isAdmin={isAdmin} users={users} currentUserId={session.userId} auditLogs={auditLogs} />
}

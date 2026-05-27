import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import PengelolaLayoutClient from '@/components/layout/PengelolaLayoutClient'

export default async function PengelolaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <PengelolaLayoutClient
      user={{
        namaLengkap: session.namaLengkap,
        role: session.role,
        username: session.username,
      }}
    >
      {children}
    </PengelolaLayoutClient>
  )
}

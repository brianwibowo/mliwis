import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import PengelolaLayoutClient from '@/components/layout/PengelolaLayoutClient'
import { prisma } from '@/lib/prisma'

export default async function PengelolaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch live user details to reflect name or photo changes instantly
  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      namaLengkap: true,
      role: true,
      username: true,
      foto: true,
    },
  })

  if (!dbUser) {
    redirect('/login')
  }

  return (
    <PengelolaLayoutClient
      user={{
        namaLengkap: dbUser.namaLengkap,
        role: dbUser.role,
        username: dbUser.username,
        foto: dbUser.foto,
      }}
    >
      {children}
    </PengelolaLayoutClient>
  )
}

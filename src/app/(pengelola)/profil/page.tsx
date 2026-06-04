export const dynamic = 'force-dynamic'

import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfilClient from './ProfilClient'

export const metadata = { title: 'Profil Saya' }

export default async function ProfilPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      namaLengkap: true,
      role: true,
      foto: true,
    },
  })

  if (!user) redirect('/login')

  return <ProfilClient user={user} />
}

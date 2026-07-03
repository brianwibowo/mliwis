import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function logAudit(action: string, target: string) {
  try {
    const session = await getSession()
    const username = session?.username || 'system'
    await prisma.auditLog.create({
      data: {
        username,
        action,
        target,
      },
    })
  } catch (err) {
    console.error('Gagal menulis log audit:', err)
  }
}

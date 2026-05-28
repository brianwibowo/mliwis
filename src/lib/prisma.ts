import 'dotenv/config'
import { PrismaClient } from '@/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const user = process.env.DB_USER || 'root'
  const password = process.env.DB_PASSWORD || ''
  const database = process.env.DB_NAME || 'si_mliwis'
  const socketPath = process.env.MYSQL_SOCKET || '/var/lib/mysql/mysql.sock'

  const adapter = new PrismaMariaDb({
    socketPath,
    user,
    password,
    database,
    connectionLimit: 2,
  })

  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Cache the Prisma client globally in both development and production
// to prevent duplicate connection pools and excessive database worker threads
globalForPrisma.prisma = prisma


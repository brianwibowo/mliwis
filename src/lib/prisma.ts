import { PrismaClient } from '@/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const host = process.env.DB_HOST || 'localhost'
  const port = Number(process.env.DB_PORT) || 3306
  const user = process.env.DB_USER || 'root'
  const password = process.env.DB_PASSWORD || ''
  const database = process.env.DB_NAME || 'si_mliwis'

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 1,
    idleTimeout: 5000, // Close idle connections after 5 seconds to free slots
    acquireTimeout: 10000, // Allow 10 seconds to wait for a connection slot before throwing
  })

  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Cache globally to prevent duplicate connection pools
globalForPrisma.prisma = prisma

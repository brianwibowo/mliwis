import { PrismaClient } from '@/generated/prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Default values or discrete environment variables
  let host = process.env.DB_HOST || 'localhost'
  let port = Number(process.env.DB_PORT) || 3306
  let user = process.env.DB_USER || 'root'
  let password = process.env.DB_PASSWORD || ''
  let database = process.env.DB_NAME || 'si_mliwis'

  // If DATABASE_URL is provided, dynamically parse it to support unified connection strings
  const dbUrl = process.env.DATABASE_URL
  if (dbUrl && dbUrl.startsWith('mysql://')) {
    try {
      const parsed = new URL(dbUrl)
      host = parsed.hostname || host
      port = Number(parsed.port) || port
      user = parsed.username || user
      password = parsed.password ? decodeURIComponent(parsed.password) : password
      database = parsed.pathname ? parsed.pathname.replace(/^\//, '') : database
    } catch (error) {
      console.error('Failed to parse DATABASE_URL, falling back to discrete variables:', error)
    }
  }

  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 5,
  })

  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

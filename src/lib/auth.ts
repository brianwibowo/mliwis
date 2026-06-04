import { SignJWT, jwtVerify } from 'jose'
import { cookies, headers } from 'next/headers'

const secretKey = process.env.BETTER_AUTH_SECRET || 'default-secret-key'
const encodedKey = new TextEncoder().encode(secretKey)
const SESSION_COOKIE_NAME = 'si-mliwis-session'

async function getCookieSecure(): Promise<boolean> {
  if (process.env.NODE_ENV !== 'production') return false
  try {
    const headersList = await headers()
    const host = headersList.get('host') || ''
    const isLocal =
      host.includes('localhost') ||
      host.includes('127.0.0.1') ||
      host.includes('[::1]') ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.startsWith('172.16.') ||
      host.startsWith('172.17.') ||
      host.startsWith('172.18.') ||
      host.startsWith('172.19.') ||
      host.startsWith('172.20.') ||
      host.startsWith('172.21.') ||
      host.startsWith('172.22.') ||
      host.startsWith('172.23.') ||
      host.startsWith('172.24.') ||
      host.startsWith('172.25.') ||
      host.startsWith('172.26.') ||
      host.startsWith('172.27.') ||
      host.startsWith('172.28.') ||
      host.startsWith('172.29.') ||
      host.startsWith('172.30.') ||
      host.startsWith('172.31.') ||
      host.endsWith('.local')
    return !isLocal
  } catch {
    return true
  }
}

export interface SessionPayload {
  userId: number
  username: string
  namaLengkap: string
  role: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload, expiresAt: payload.expiresAt.toISOString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined): Promise<SessionPayload | null> {
  if (!session) return null
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return {
      userId: payload.userId as number,
      username: payload.username as string,
      namaLengkap: payload.namaLengkap as string,
      role: payload.role as string,
      expiresAt: new Date(payload.expiresAt as string),
    }
  } catch {
    return null
  }
}

export async function createSession(user: {
  id: number
  username: string
  namaLengkap: string
  role: string
}): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari
  const session = await encrypt({
    userId: user.id,
    username: user.username,
    namaLengkap: user.namaLengkap,
    role: user.role,
    expiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: await getCookieSecure(),
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return decrypt(session)
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function updateSession(): Promise<void> {
  const session = await getSession()
  if (!session) return

  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const newSession = await encrypt({
    ...session,
    expiresAt: newExpiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: await getCookieSecure(),
    expires: newExpiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

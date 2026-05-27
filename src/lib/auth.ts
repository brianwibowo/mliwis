import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.BETTER_AUTH_SECRET || 'default-secret-key'
const encodedKey = new TextEncoder().encode(secretKey)
const SESSION_COOKIE_NAME = 'si-mliwis-session'

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
    secure: process.env.NODE_ENV === 'production',
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
    secure: process.env.NODE_ENV === 'production',
    expires: newExpiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

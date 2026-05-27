'use server'

import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export interface LoginState {
  error?: string
  success?: boolean
}

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Username dan password harus diisi' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return { error: 'Username atau password salah' }
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return { error: 'Username atau password salah' }
    }

    await createSession({
      id: user.id,
      username: user.username,
      namaLengkap: user.namaLengkap,
      role: user.role,
    })
  } catch {
    return { error: 'Terjadi kesalahan sistem. Silakan coba lagi.' }
  }

  redirect('/dashboard')
}

export async function logoutAction(): Promise<void> {
  await deleteSession()
  redirect('/login')
}

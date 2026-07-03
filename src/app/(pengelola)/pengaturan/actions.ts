'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { logAudit } from '@/lib/audit'

export async function getUsers() {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' }

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' }, select: { id: true, username: true, namaLengkap: true, role: true, createdAt: true } })
  return { data: users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })) }
}

export async function getAuditLogs() {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return { data: logs.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })) }
}

export async function createUser(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' }

  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const namaLengkap = formData.get('namaLengkap') as string
  const role = formData.get('role') as string

  if (!username || !password || !namaLengkap || !role) return { error: 'Semua field wajib diisi' }

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) return { error: 'Username sudah digunakan' }

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { username, password: hashed, namaLengkap, role } })
  
  await logAudit('CREATE_USER', `Pengelola baru ditambahkan: username "${username}" dengan peran "${role}"`)
  
  revalidatePath('/pengaturan')
  return { success: true }
}

export async function updateUser(id: number, formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' }

  const namaLengkap = formData.get('namaLengkap') as string
  const role = formData.get('role') as string
  const password = formData.get('password') as string

  const updateData: Record<string, unknown> = { namaLengkap, role }
  if (password) updateData.password = await bcrypt.hash(password, 10)

  await prisma.user.update({ where: { id }, data: updateData })
  
  await logAudit('UPDATE_USER', `Pengelola ID ${id} diperbarui: nama "${namaLengkap}", peran "${role}"`)
  
  revalidatePath('/pengaturan')
  return { success: true }
}

export async function deleteUser(id: number) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' }
  if (session.userId === id) return { error: 'Tidak bisa menghapus akun sendiri' }

  const old = await prisma.user.findUnique({ where: { id } })
  const username = old?.username || String(id)

  await prisma.user.delete({ where: { id } })
  
  await logAudit('DELETE_USER', `Pengelola "${username}" (ID: ${id}) dihapus dari sistem`)
  
  revalidatePath('/pengaturan')
  return { success: true }
}

export async function changePassword(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const oldPassword = formData.get('oldPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!oldPassword || !newPassword || !confirmPassword) return { error: 'Semua field wajib diisi' }
  if (newPassword !== confirmPassword) return { error: 'Password baru tidak cocok' }
  if (newPassword.length < 6) return { error: 'Password minimal 6 karakter' }

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) return { error: 'User tidak ditemukan' }

  const valid = await bcrypt.compare(oldPassword, user.password)
  if (!valid) return { error: 'Password lama salah' }

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id: session.userId }, data: { password: hashed } })
  
  await logAudit('CHANGE_PASSWORD', `Pengguna "${session.username}" mengubah password pribadinya`)
  
  return { success: true }
}


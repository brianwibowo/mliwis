'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { put } from '@vercel/blob'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

export async function updateProfile(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Sesi habis, silakan login kembali' }

  const namaLengkap = formData.get('namaLengkap') as string
  const file = formData.get('foto') as File | null
  const oldPassword = formData.get('oldPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!namaLengkap) {
    return { error: 'Nama Lengkap wajib diisi' }
  }

  const updateData: Record<string, any> = { namaLengkap }

  // 1. Handle Foto Profil Upload
  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif']
    const isAllowedExt = allowedExtensions.includes(ext)
    const isAllowedMime = ALLOWED_IMAGE_TYPES.includes(file.type) || file.type.startsWith('image/')

    if (!isAllowedExt && !isAllowedMime) {
      return { error: 'Format foto tidak didukung. Gunakan JPG, PNG, GIF, WEBP, atau HEIC/HEIF' }
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return { error: 'Ukuran foto maksimal 5MB' }
    }

    try {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        // Upload to Vercel Blob
        const blob = await put(file.name, file, { access: 'public' })
        updateData.foto = blob.url
      } else {
        // Save locally to public/uploads
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        await mkdir(uploadsDir, { recursive: true })

        const ext = path.extname(file.name) || '.jpg'
        const uniqueName = `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
        const filePath = `/uploads/${uniqueName}`
        const fullPath = path.join(uploadsDir, uniqueName)

        const buffer = Buffer.from(await file.arrayBuffer())
        await writeFile(fullPath, buffer)
        updateData.foto = filePath
      }
    } catch (e: any) {
      return { error: `Gagal mengunggah foto: ${e.message || e}` }
    }
  }

  // 2. Handle Password Change (jika diisi)
  if (oldPassword || newPassword || confirmPassword) {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return { error: 'Untuk mengubah password, lengkapi semua bidang password' }
    }
    if (newPassword !== confirmPassword) {
      return { error: 'Password baru dan konfirmasi tidak cocok' }
    }
    if (newPassword.length < 6) {
      return { error: 'Password baru minimal 6 karakter' }
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } })
    if (!user) return { error: 'Pengguna tidak ditemukan' }

    const valid = await bcrypt.compare(oldPassword, user.password)
    if (!valid) return { error: 'Password lama salah' }

    updateData.password = await bcrypt.hash(newPassword, 10)
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    })
    
    revalidatePath('/(pengelola)', 'layout') // Revalidate parent layout to reload sidebar
    revalidatePath('/profil')
    
    return { success: true }
  } catch (e: any) {
    return { error: `Gagal memperbarui profil: ${e.message || e}` }
  }
}

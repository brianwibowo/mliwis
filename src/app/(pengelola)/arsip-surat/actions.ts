'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/constants'
import { put, del } from '@vercel/blob'

// ==================== SURAT MASUK ====================

export async function getSuratMasuk(search?: string, page = 1, perPage = 10) {
  const where = search
    ? {
        OR: [
          { nomorSurat: { contains: search } },
          { pengirim: { contains: search } },
          { perihal: { contains: search } },
        ],
      }
    : {}

  const [data, total] = await Promise.all([
    prisma.suratMasuk.findMany({
      where,
      orderBy: { tanggalSurat: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { user: { select: { namaLengkap: true } } },
    }),
    prisma.suratMasuk.count({ where }),
  ])

  return {
    data: data.map((s) => ({
      ...s,
      tanggalSurat: s.tanggalSurat.toISOString(),
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    total,
    totalPages: Math.ceil(total / perPage),
  }
}

export async function createSuratMasuk(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const nomorSurat = formData.get('nomorSurat') as string
  const tanggalSurat = formData.get('tanggalSurat') as string
  const pengirim = formData.get('pengirim') as string
  const tujuan = formData.get('tujuan') as string
  const perihal = formData.get('perihal') as string
  const file = formData.get('file') as File | null

  if (!nomorSurat || !tanggalSurat || !pengirim || !tujuan || !perihal) {
    return { error: 'Semua field wajib diisi' }
  }

  let filePath: string | null = null
  let namaFile: string | null = null

  if (file && file.size > 0) {
    const result = await uploadFile(file)
    if (result.error) return { error: result.error }
    filePath = result.filePath!
    namaFile = result.namaFile!
  }

  await prisma.suratMasuk.create({
    data: {
      nomorSurat,
      tanggalSurat: new Date(tanggalSurat),
      pengirim,
      tujuan,
      perihal,
      filePath,
      namaFile,
      userId: session.userId,
    },
  })

  revalidatePath('/arsip-surat/masuk')
  return { success: true }
}

export async function updateSuratMasuk(id: number, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const nomorSurat = formData.get('nomorSurat') as string
  const tanggalSurat = formData.get('tanggalSurat') as string
  const pengirim = formData.get('pengirim') as string
  const tujuan = formData.get('tujuan') as string
  const perihal = formData.get('perihal') as string
  const file = formData.get('file') as File | null

  const updateData: Record<string, unknown> = {
    nomorSurat,
    tanggalSurat: new Date(tanggalSurat),
    pengirim,
    tujuan,
    perihal,
  }

  if (file && file.size > 0) {
    const result = await uploadFile(file)
    if (result.error) return { error: result.error }
    updateData.filePath = result.filePath
    updateData.namaFile = result.namaFile
  }

  await prisma.suratMasuk.update({ where: { id }, data: updateData })
  revalidatePath('/arsip-surat/masuk')
  return { success: true }
}

export async function deleteSuratMasuk(id: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const surat = await prisma.suratMasuk.findUnique({ where: { id } })
  if (surat?.filePath) {
    if (surat.filePath.startsWith('http')) {
      try { await del(surat.filePath) } catch {}
    } else {
      try { await unlink(path.join(process.cwd(), 'public', surat.filePath)) } catch {}
    }
  }

  await prisma.suratMasuk.delete({ where: { id } })
  revalidatePath('/arsip-surat/masuk')
  return { success: true }
}

// ==================== SURAT KELUAR ====================

export async function getSuratKeluar(search?: string, page = 1, perPage = 10) {
  const where = search
    ? {
        OR: [
          { nomorSurat: { contains: search } },
          { tujuan: { contains: search } },
          { perihal: { contains: search } },
        ],
      }
    : {}

  const [data, total] = await Promise.all([
    prisma.suratKeluar.findMany({
      where,
      orderBy: { tanggalSurat: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { user: { select: { namaLengkap: true } } },
    }),
    prisma.suratKeluar.count({ where }),
  ])

  return {
    data: data.map((s) => ({
      ...s,
      tanggalSurat: s.tanggalSurat.toISOString(),
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    total,
    totalPages: Math.ceil(total / perPage),
  }
}

export async function createSuratKeluar(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const nomorSurat = formData.get('nomorSurat') as string
  const tanggalSurat = formData.get('tanggalSurat') as string
  const pengirim = formData.get('pengirim') as string
  const tujuan = formData.get('tujuan') as string
  const perihal = formData.get('perihal') as string
  const file = formData.get('file') as File | null

  if (!nomorSurat || !tanggalSurat || !pengirim || !tujuan || !perihal) {
    return { error: 'Semua field wajib diisi' }
  }

  let filePath: string | null = null
  let namaFile: string | null = null

  if (file && file.size > 0) {
    const result = await uploadFile(file)
    if (result.error) return { error: result.error }
    filePath = result.filePath!
    namaFile = result.namaFile!
  }

  await prisma.suratKeluar.create({
    data: { nomorSurat, tanggalSurat: new Date(tanggalSurat), pengirim, tujuan, perihal, filePath, namaFile, userId: session.userId },
  })

  revalidatePath('/arsip-surat/keluar')
  return { success: true }
}

export async function updateSuratKeluar(id: number, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const nomorSurat = formData.get('nomorSurat') as string
  const tanggalSurat = formData.get('tanggalSurat') as string
  const pengirim = formData.get('pengirim') as string
  const tujuan = formData.get('tujuan') as string
  const perihal = formData.get('perihal') as string
  const file = formData.get('file') as File | null

  const updateData: Record<string, unknown> = { nomorSurat, tanggalSurat: new Date(tanggalSurat), pengirim, tujuan, perihal }

  if (file && file.size > 0) {
    const result = await uploadFile(file)
    if (result.error) return { error: result.error }
    updateData.filePath = result.filePath
    updateData.namaFile = result.namaFile
  }

  await prisma.suratKeluar.update({ where: { id }, data: updateData })
  revalidatePath('/arsip-surat/keluar')
  return { success: true }
}

export async function deleteSuratKeluar(id: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const surat = await prisma.suratKeluar.findUnique({ where: { id } })
  if (surat?.filePath) {
    if (surat.filePath.startsWith('http')) {
      try { await del(surat.filePath) } catch {}
    } else {
      try { await unlink(path.join(process.cwd(), 'public', surat.filePath)) } catch {}
    }
  }

  await prisma.suratKeluar.delete({ where: { id } })
  revalidatePath('/arsip-surat/keluar')
  return { success: true }
}

// ==================== FILE UPLOAD HELPER ====================

async function uploadFile(file: File) {
  if (!ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number])) {
    return { error: `Tipe file tidak didukung. Gunakan: PDF, JPG, PNG, HEIC, HEIF` }
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: 'Ukuran file maksimal 10MB' }
  }

  // If Vercel Blob token is configured, upload directly to Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(file.name, file, { access: 'public' })
      return { filePath: blob.url, namaFile: file.name }
    } catch (e: any) {
      return { error: `Gagal upload ke cloud storage: ${e.message || e}` }
    }
  }

  // Fallback to local file system (e.g. during local development)
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })

  const ext = path.extname(file.name)
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
  const filePath = `/uploads/${uniqueName}`
  const fullPath = path.join(uploadsDir, uniqueName)

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(fullPath, buffer)

  return { filePath, namaFile: file.name }
}

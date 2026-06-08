'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/constants'
import { put, del } from '@vercel/blob'

// ==================== HELPERS ====================

async function uploadFile(file: File) {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || ''
  const isAllowedExt = ['.pdf', '.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp', '.gif', '.svg', '.bmp', '.tiff'].includes('.' + fileExt)
  const isAllowedMime = file.type.startsWith('image/') || file.type === 'application/pdf'

  if (!isAllowedExt && !isAllowedMime) {
    return { error: `Tipe file tidak didukung. Gunakan: PDF, JPG, PNG, WEBP, GIF, SVG, HEIC, HEIF` }
  }
  if (file.size > MAX_FILE_SIZE) {
    return { error: 'Ukuran file maksimal 10MB' }
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(file.name, file, { access: 'public' })
      return { filePath: blob.url, namaFile: file.name }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      return { error: `Gagal upload ke cloud storage: ${message}` }
    }
  }

  // Fallback to local file system
  const { writeFile, mkdir } = await import('fs/promises')
  const path = await import('path')
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

async function deleteFile(filePath: string) {
  if (filePath.startsWith('http')) {
    try { await del(filePath) } catch { /* ignore */ }
  } else {
    try {
      const { unlink } = await import('fs/promises')
      const path = await import('path')
      await unlink(path.join(process.cwd(), 'public', filePath))
    } catch { /* ignore */ }
  }
}

// ==================== GET LIST ====================

export async function getProgramKerja(search?: string, status?: string, page = 1, perPage = 10) {
  const conditions: Record<string, unknown>[] = []

  if (search) {
    conditions.push({
      OR: [
        { namaKegiatan: { contains: search } },
        { sumberDana: { contains: search } },
      ],
    })
  }

  if (status && status !== 'Semua') {
    conditions.push({ statusKegiatan: status })
  }

  const where = conditions.length > 0 ? { AND: conditions } : {}

  const [data, total] = await Promise.all([
    prisma.programKerja.findMany({
      where,
      orderBy: { tanggalKegiatan: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        user: { select: { namaLengkap: true } },
        dokumentasi: { select: { id: true, filePath: true, namaFile: true } },
      },
    }),
    prisma.programKerja.count({ where }),
  ])

  return {
    data: data.map((pk) => ({
      ...pk,
      tanggalKegiatan: pk.tanggalKegiatan.toISOString(),
      jumlahDana: Number(pk.jumlahDana),
      createdAt: pk.createdAt.toISOString(),
      updatedAt: pk.updatedAt.toISOString(),
    })),
    total,
    totalPages: Math.ceil(total / perPage),
  }
}

// ==================== GET DETAIL ====================

export async function getProgramKerjaById(id: number) {
  const pk = await prisma.programKerja.findUnique({
    where: { id },
    include: {
      user: { select: { namaLengkap: true } },
      dokumentasi: { orderBy: { createdAt: 'asc' } },
    },
  })

  if (!pk) return null

  return {
    ...pk,
    tanggalKegiatan: pk.tanggalKegiatan.toISOString(),
    jumlahDana: Number(pk.jumlahDana),
    createdAt: pk.createdAt.toISOString(),
    updatedAt: pk.updatedAt.toISOString(),
    dokumentasi: pk.dokumentasi.map((d) => ({
      ...d,
      createdAt: d.createdAt.toISOString(),
    })),
  }
}

// ==================== CREATE ====================

export async function createProgramKerja(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const namaKegiatan = formData.get('namaKegiatan') as string
  const tanggalKegiatan = formData.get('tanggalKegiatan') as string
  const jumlahDana = Number(formData.get('jumlahDana'))
  const sumberDana = formData.get('sumberDana') as string
  const statusKegiatan = formData.get('statusKegiatan') as string

  if (!namaKegiatan || !tanggalKegiatan || !jumlahDana || !sumberDana || !statusKegiatan) {
    return { error: 'Semua field wajib diisi' }
  }

  const pk = await prisma.programKerja.create({
    data: {
      namaKegiatan,
      tanggalKegiatan: new Date(tanggalKegiatan),
      jumlahDana,
      sumberDana,
      statusKegiatan,
      userId: session.userId,
    },
  })

  // Handle multiple file uploads
  const files = formData.getAll('dokumentasi') as File[]
  for (const file of files) {
    if (file && file.size > 0) {
      const result = await uploadFile(file)
      if (result.error) return { error: result.error }
      await prisma.programKerjaDokumentasi.create({
        data: {
          programKerjaId: pk.id,
          filePath: result.filePath!,
          namaFile: result.namaFile!,
        },
      })
    }
  }

  revalidatePath('/program-kerja')
  return { success: true }
}

// ==================== UPDATE ====================

export async function updateProgramKerja(id: number, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const namaKegiatan = formData.get('namaKegiatan') as string
  const tanggalKegiatan = formData.get('tanggalKegiatan') as string
  const jumlahDana = Number(formData.get('jumlahDana'))
  const sumberDana = formData.get('sumberDana') as string
  const statusKegiatan = formData.get('statusKegiatan') as string

  await prisma.programKerja.update({
    where: { id },
    data: {
      namaKegiatan,
      tanggalKegiatan: new Date(tanggalKegiatan),
      jumlahDana,
      sumberDana,
      statusKegiatan,
    },
  })

  // Handle new file uploads (appended)
  const files = formData.getAll('dokumentasi') as File[]
  for (const file of files) {
    if (file && file.size > 0) {
      const result = await uploadFile(file)
      if (result.error) return { error: result.error }
      await prisma.programKerjaDokumentasi.create({
        data: {
          programKerjaId: id,
          filePath: result.filePath!,
          namaFile: result.namaFile!,
        },
      })
    }
  }

  // Handle deletions of existing dokumentasi
  const deletedIds = formData.get('deletedDokumentasiIds') as string
  if (deletedIds) {
    const ids = JSON.parse(deletedIds) as number[]
    if (ids.length > 0) {
      const docs = await prisma.programKerjaDokumentasi.findMany({
        where: { id: { in: ids }, programKerjaId: id },
      })
      for (const doc of docs) {
        await deleteFile(doc.filePath)
      }
      await prisma.programKerjaDokumentasi.deleteMany({
        where: { id: { in: ids }, programKerjaId: id },
      })
    }
  }

  revalidatePath('/program-kerja')
  revalidatePath(`/program-kerja/${id}`)
  return { success: true }
}

// ==================== DELETE ====================

export async function deleteProgramKerja(id: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  // Delete all dokumentasi files first
  const docs = await prisma.programKerjaDokumentasi.findMany({
    where: { programKerjaId: id },
  })
  for (const doc of docs) {
    await deleteFile(doc.filePath)
  }

  // Cascade will handle DB deletion of dokumentasi
  await prisma.programKerja.delete({ where: { id } })

  revalidatePath('/program-kerja')
  return { success: true }
}

// ==================== DELETE SINGLE DOKUMENTASI ====================

export async function deleteDokumentasi(id: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const doc = await prisma.programKerjaDokumentasi.findUnique({ where: { id } })
  if (!doc) return { error: 'Dokumentasi tidak ditemukan' }

  await deleteFile(doc.filePath)
  await prisma.programKerjaDokumentasi.deleteMany({ where: { id } })

  revalidatePath('/program-kerja')
  revalidatePath(`/program-kerja/${doc.programKerjaId}`)
  return { success: true }
}

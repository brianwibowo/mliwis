'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/constants'
import { put, del } from '@vercel/blob'

// Helper for file uploading
async function uploadFile(file: File) {
  if (!ALLOWED_FILE_TYPES.includes(file.type as typeof ALLOWED_FILE_TYPES[number])) {
    return { error: `Tipe file tidak didukung. Gunakan: PDF, JPG, PNG, HEIC, HEIF` }
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
  if (!filePath) return
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

// Generate a slug from title and ensure it is unique
async function generateUniqueSlug(title: string, currentId?: number): Promise<string> {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  if (!slug) {
    slug = 'berita-' + Date.now()
  }

  let uniqueSlug = slug
  let counter = 1
  while (true) {
    const existing = await prisma.berita.findFirst({
      where: {
        slug: uniqueSlug,
        NOT: currentId ? { id: currentId } : undefined
      }
    })
    if (!existing) break
    uniqueSlug = `${slug}-${counter}`
    counter++
  }

  return uniqueSlug
}

// ==================== ACTIONS ====================

export async function getBeritaAdmin(search?: string, published?: string, page = 1, perPage = 10) {
  const conditions: Record<string, unknown>[] = []

  if (search) {
    conditions.push({
      OR: [
        { judul: { contains: search } },
        { ringkasan: { contains: search } },
        { penulis: { contains: search } },
      ]
    })
  }

  if (published === 'true') {
    conditions.push({ published: true })
  } else if (published === 'false') {
    conditions.push({ published: false })
  }

  const where = conditions.length > 0 ? { AND: conditions } : {}

  const [data, total] = await Promise.all([
    prisma.berita.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        user: { select: { namaLengkap: true } }
      }
    }),
    prisma.berita.count({ where })
  ])

  return {
    data: data.map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    })),
    total,
    totalPages: Math.ceil(total / perPage),
  }
}

export async function getBeritaById(id: number) {
  const b = await prisma.berita.findUnique({
    where: { id }
  })
  if (!b) return null

  return {
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    konten: b.konten as Array<{ type: string; value: string; fileKey?: string }>,
  }
}

export async function createBerita(formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const judul = formData.get('judul') as string
  const kategori = formData.get('kategori') as string
  const ringkasan = formData.get('ringkasan') as string
  const penulis = formData.get('penulis') as string
  const published = formData.get('published') === 'true'
  const linkExternal = formData.get('linkExternal') as string || null

  if (!judul || !kategori || !ringkasan || !penulis) {
    return { error: 'Judul, Kategori, Ringkasan, dan Penulis wajib diisi' }
  }

  // Upload main cover image if any
  let gambarUtamaPath = ''
  const gambarUtamaFile = formData.get('gambarUtama') as File | null
  if (gambarUtamaFile && gambarUtamaFile.size > 0) {
    const uploadResult = await uploadFile(gambarUtamaFile)
    if (uploadResult.error) return { error: uploadResult.error }
    gambarUtamaPath = uploadResult.filePath!
  }

  // Parse and process dynamic content blocks
  const blocksMetaRaw = formData.get('blocksMeta') as string
  const blocksMeta = blocksMetaRaw ? JSON.parse(blocksMetaRaw) : []
  const processedBlocks: Array<{ type: string; value: string }> = []

  for (const block of blocksMeta) {
    if (block.type === 'text') {
      processedBlocks.push({ type: 'text', value: block.value || '' })
    } else if (block.type === 'image') {
      // If it's a new image block, it has a fileKey
      if (block.fileKey) {
        const file = formData.get(block.fileKey) as File | null
        if (file && file.size > 0) {
          const uploadResult = await uploadFile(file)
          if (uploadResult.error) return { error: uploadResult.error }
          processedBlocks.push({ type: 'image', value: uploadResult.filePath! })
        } else if (block.value) {
          // Fallback or old value
          processedBlocks.push({ type: 'image', value: block.value })
        } else {
          processedBlocks.push({ type: 'image', value: '' })
        }
      } else {
        // Existing image value
        processedBlocks.push({ type: 'image', value: block.value || '' })
      }
    }
  }

  const slug = await generateUniqueSlug(judul)

  await prisma.berita.create({
    data: {
      judul,
      slug,
      konten: processedBlocks,
      ringkasan,
      gambarUtama: gambarUtamaPath || null,
      kategori,
      linkExternal,
      penulis,
      published,
      userId: session.userId
    }
  })

  revalidatePath('/berita-admin')
  revalidatePath('/berita-kegiatan')
  return { success: true }
}

export async function updateBerita(id: number, formData: FormData) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const judul = formData.get('judul') as string
  const kategori = formData.get('kategori') as string
  const ringkasan = formData.get('ringkasan') as string
  const penulis = formData.get('penulis') as string
  const published = formData.get('published') === 'true'
  const linkExternal = formData.get('linkExternal') as string || null

  if (!judul || !kategori || !ringkasan || !penulis) {
    return { error: 'Judul, Kategori, Ringkasan, dan Penulis wajib diisi' }
  }

  const existingBerita = await prisma.berita.findUnique({
    where: { id }
  })
  if (!existingBerita) return { error: 'Berita tidak ditemukan' }

  // Handle cover image
  let gambarUtamaPath = existingBerita.gambarUtama || ''
  const gambarUtamaFile = formData.get('gambarUtama') as File | null
  const keepGambarUtama = formData.get('keepGambarUtama') === 'true'

  if (!keepGambarUtama && existingBerita.gambarUtama) {
    await deleteFile(existingBerita.gambarUtama)
    gambarUtamaPath = ''
  }

  if (gambarUtamaFile && gambarUtamaFile.size > 0) {
    // Delete old one if exists
    if (existingBerita.gambarUtama) {
      await deleteFile(existingBerita.gambarUtama)
    }
    const uploadResult = await uploadFile(gambarUtamaFile)
    if (uploadResult.error) return { error: uploadResult.error }
    gambarUtamaPath = uploadResult.filePath!
  }

  // Parse and process dynamic content blocks
  const blocksMetaRaw = formData.get('blocksMeta') as string
  const blocksMeta = blocksMetaRaw ? JSON.parse(blocksMetaRaw) : []
  const processedBlocks: Array<{ type: string; value: string }> = []

  // Keep track of images currently used to clean up unused ones from disk
  const newImageUrls: string[] = []

  for (const block of blocksMeta) {
    if (block.type === 'text') {
      processedBlocks.push({ type: 'text', value: block.value || '' })
    } else if (block.type === 'image') {
      if (block.fileKey) {
        const file = formData.get(block.fileKey) as File | null
        if (file && file.size > 0) {
          const uploadResult = await uploadFile(file)
          if (uploadResult.error) return { error: uploadResult.error }
          processedBlocks.push({ type: 'image', value: uploadResult.filePath! })
          newImageUrls.push(uploadResult.filePath!)
        } else if (block.value) {
          processedBlocks.push({ type: 'image', value: block.value })
          newImageUrls.push(block.value)
        } else {
          processedBlocks.push({ type: 'image', value: '' })
        }
      } else {
        processedBlocks.push({ type: 'image', value: block.value || '' })
        if (block.value) {
          newImageUrls.push(block.value)
        }
      }
    }
  }

  // Clean up old block images that are no longer referenced in the updated content
  const oldBlocks = existingBerita.konten as Array<{ type: string; value: string }> || []
  for (const oldBlock of oldBlocks) {
    if (oldBlock.type === 'image' && oldBlock.value && !newImageUrls.includes(oldBlock.value)) {
      await deleteFile(oldBlock.value)
    }
  }

  // Generate unique slug only if title changes
  let slug = existingBerita.slug
  if (existingBerita.judul !== judul) {
    slug = await generateUniqueSlug(judul, id)
  }

  await prisma.berita.update({
    where: { id },
    data: {
      judul,
      slug,
      konten: processedBlocks,
      ringkasan,
      gambarUtama: gambarUtamaPath || null,
      kategori,
      linkExternal,
      penulis,
      published,
    }
  })

  revalidatePath('/berita-admin')
  revalidatePath('/berita-kegiatan')
  revalidatePath(`/berita-kegiatan/${slug}`)
  return { success: true }
}

export async function deleteBerita(id: number) {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  const b = await prisma.berita.findUnique({ where: { id } })
  if (!b) return { error: 'Berita tidak ditemukan' }

  // Delete cover image
  if (b.gambarUtama) {
    await deleteFile(b.gambarUtama)
  }

  // Delete all block images
  const blocks = b.konten as Array<{ type: string; value: string }> || []
  for (const block of blocks) {
    if (block.type === 'image' && block.value) {
      await deleteFile(block.value)
    }
  }

  await prisma.berita.delete({ where: { id } })

  revalidatePath('/berita-admin')
  revalidatePath('/berita-kegiatan')
  return { success: true }
}

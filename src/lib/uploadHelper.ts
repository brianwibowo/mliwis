import { convertHeicToJpeg, compressImageIfNeeded } from '@/lib/utils'

export interface PrepareFileOptions {
  maxSizeBytes?: number
  allowedExtensions?: string[]
  notifyFn?: (message: string, type: 'info' | 'error' | 'success') => string | void
  removeNotifyFn?: (id?: string) => void
}

/**
 * Prepares a user-selected file for upload by validating type/size,
 * automatically converting iPhone HEIC photos, downscaling resolution,
 * and compressing images before sending to server.
 */
export async function prepareUploadFile(
  file: File,
  options?: PrepareFileOptions
): Promise<{ file: File | null; error?: string }> {
  if (!file) return { file: null }

  const defaultExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic', 'heif', 'pdf']
  const allowedExts = options?.allowedExtensions || defaultExts

  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const isAllowedExt = allowedExts.includes(ext)
  const isAllowedMime = file.type.startsWith('image/') || file.type === 'application/pdf'

  if (!isAllowedExt && !isAllowedMime) {
    return {
      file: null,
      error: `Format file tidak didukung (${ext.toUpperCase()}). Gunakan format gambar (JPG, PNG, WEBP, HEIC) atau PDF.`
    }
  }

  // Visual notification for HEIC or large files
  const isHeic = ext === 'heic' || ext === 'heif' || file.type.includes('heic') || file.type.includes('heif')
  const isLarge = file.size > 2 * 1024 * 1024

  let notifyId: string | void = undefined
  if ((isHeic || isLarge) && options?.notifyFn) {
    notifyId = options.notifyFn('Memproses & mengompresi foto agar cepat terunggah...', 'info')
  }

  try {
    let processedFile = file

    // 1. Convert HEIC to JPEG if iPhone photo
    if (isHeic) {
      processedFile = await convertHeicToJpeg(file)
    }

    // 2. Compress image down to max 1MB and max 1600px width/height
    if (processedFile.type.startsWith('image/')) {
      const maxSizeBytes = options?.maxSizeBytes || 1 * 1024 * 1024
      processedFile = await compressImageIfNeeded(processedFile, maxSizeBytes)
    }

    if (notifyId && options?.removeNotifyFn) {
      options.removeNotifyFn(notifyId as string)
    }

    return { file: processedFile }
  } catch (err: unknown) {
    if (notifyId && options?.removeNotifyFn) {
      options.removeNotifyFn(notifyId as string)
    }
    const message = err instanceof Error ? err.message : String(err)
    return { file: null, error: `Gagal memproses gambar: ${message}` }
  }
}

/**
 * Creates a Blob Object URL while automatically revoking previous URL
 * to avoid memory leaks on mobile devices.
 */
export function createSafeObjectUrl(file: File, oldUrl?: string | null): string {
  if (oldUrl && oldUrl.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(oldUrl)
    } catch {
      /* ignore */
    }
  }
  return URL.createObjectURL(file)
}

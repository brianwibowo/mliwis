import { getSession } from '@/lib/auth'

export interface ActionResponse<T = unknown> {
  success?: boolean
  data?: T
  error?: string
}

/**
 * Helper wrapper untuk Server Actions agar semua error server & database
 * ditangani secara aman tanpa menyebabkan crash HTTP 500 pada client.
 */
export async function safeServerAction<T>(
  actionFn: () => Promise<ActionResponse<T>>,
  options?: { requireAuth?: boolean }
): Promise<ActionResponse<T>> {
  try {
    if (options?.requireAuth) {
      const session = await getSession()
      if (!session) {
        return { error: 'Sesi Anda telah berakhir. Silakan login kembali.' }
      }
    }
    return await actionFn()
  } catch (error: unknown) {
    console.error('[ServerAction Error]:', error)

    const message = error instanceof Error ? error.message : String(error)

    // Handle common server & database errors
    if (message.includes('ECONNREFUSED') || message.includes('ETIMEDOUT') || message.includes('Can\'t reach database server')) {
      return { error: 'Koneksi ke database terputus sementara. Harap coba beberapa saat lagi.' }
    }

    if (message.includes('Payload Too Large') || message.includes('413')) {
      return { error: 'Ukuran file atau data terlalu besar (maksimal 10MB).' }
    }

    if (message.includes('Record to update not found') || message.includes('Record to delete does not exist')) {
      return { error: 'Data yang dipilih tidak ditemukan atau sudah dihapus.' }
    }

    if (message.includes('Unique constraint failed')) {
      return { error: 'Data dengan informasi ini sudah ada di sistem.' }
    }

    return { error: `Terjadi kendala sistem: ${message}` }
  }
}

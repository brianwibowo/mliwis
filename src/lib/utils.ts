// ============================================================
// Utilitas Umum
// ============================================================

/**
 * Gabungkan class name, abaikan nilai falsy.
 *
 * @example cn('btn', isActive && 'btn-active', undefined) → 'btn btn-active'
 */
export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Promise-based delay.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Kembalikan CSS class sesuai status booking.
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'menunggu':
      return 'status-menunggu';
    case 'disetujui':
      return 'status-disetujui';
    case 'ditolak':
      return 'status-ditolak';
    default:
      return 'status-default';
  }
}

/**
 * Potong string ke panjang tertentu, tambahkan ellipsis jika dipotong.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}

/**
 * Debounce — tunda eksekusi fungsi sampai tidak ada panggilan selama `ms` milidetik.
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Konversi file HEIC/HEIF ke JPEG jika berjalan di browser.
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  if (typeof window === 'undefined') return file;

  const ext = file.name.split('.').pop()?.toLowerCase();
  const isHeic =
    ext === 'heic' ||
    ext === 'heif' ||
    file.type === 'image/heic' ||
    file.type === 'image/heif';

  if (!isHeic) return file;

  try {
    const heic2any = (await import('heic2any')).default;
    const blob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.8,
    });

    const convertedBlob = Array.isArray(blob) ? blob[0] : blob;
    const newName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
    return new File([convertedBlob], newName, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Gagal mengonversi HEIC ke JPEG:', error);
    return file;
  }
}

/**
 * Kompres file gambar jika ukurannya melebihi batas (default 5MB).
 * Hanya berjalan di lingkungan browser.
 */
export async function compressImageIfNeeded(
  file: File,
  maxSizeBytes: number = 1 * 1024 * 1024
): Promise<File> {
  if (typeof window === 'undefined') {
    return file;
  }

  // 1. Konversi HEIC ke JPEG jika berupa file HEIC/HEIF
  const convertedFile = await convertHeicToJpeg(file);

  // 2. Cek tipe file (harus gambar)
  if (!convertedFile.type.startsWith('image/')) {
    return convertedFile;
  }

  // 3. Cek ukuran file
  if (convertedFile.size <= maxSizeBytes) {
    return convertedFile;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Batasi resolusi maksimal 2048px untuk efisiensi
        const maxDimension = 2048;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(convertedFile);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        const step = 0.1;

        const checkAndResolve = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                if (blob.size > maxSizeBytes && q > 0.1) {
                  checkAndResolve(q - step);
                } else {
                  const compressedFile = new File([blob], convertedFile.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                }
              } else {
                resolve(convertedFile);
              }
            },
            'image/jpeg',
            q
          );
        };

        checkAndResolve(quality);
      };
      img.onerror = () => resolve(convertedFile);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(convertedFile);
    reader.readAsDataURL(convertedFile);
  });
}

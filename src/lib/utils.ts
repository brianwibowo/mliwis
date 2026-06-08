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
 * Kompres file gambar jika ukurannya melebihi batas (default 5MB).
 * Hanya berjalan di lingkungan browser.
 */
export async function compressImageIfNeeded(
  file: File,
  maxSizeBytes: number = 5 * 1024 * 1024
): Promise<File> {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
    return file;
  }

  if (file.size <= maxSizeBytes) {
    return file;
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
          resolve(file);
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
                  const compressedFile = new File([blob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                }
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            q
          );
        };

        checkAndResolve(quality);
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

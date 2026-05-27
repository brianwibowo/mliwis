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

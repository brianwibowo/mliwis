// Decimal-compatible type (works with Prisma Decimal values)
type DecimalLike = { toString(): string };

// ============================================================
// Formatter — Rupiah, Tanggal, Kode
// ============================================================

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatRupiah(amount: number | DecimalLike): string {
  const value = typeof amount === 'number' ? amount : Number(amount);
  // Remove all spaces and non-breaking spaces (\u00A0) to prevent server/client hydration mismatch
  return rupiahFormatter.format(value).replace(/\s| /g, '');
}

const tanggalFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/**
 * Format tanggal ke `27 Mei 2026`
 */
export function formatTanggal(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return tanggalFormatter.format(d);
}

const tanggalSingkatFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/**
 * Format tanggal singkat ke `27/05/2026`
 */
export function formatTanggalSingkat(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return tanggalSingkatFormatter.format(d);
}

const tanggalWaktuFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/**
 * Format tanggal + waktu ke `27 Mei 2026, 14:30`
 */
export function formatTanggalWaktu(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return tanggalWaktuFormatter.format(d);
}

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generate kode booking: `BK-A1B2C3D4`
 */
export function generateKodeBooking(): string {
  let result = 'BK-';
  for (let i = 0; i < 8; i++) {
    result += ALPHANUMERIC.charAt(
      Math.floor(Math.random() * ALPHANUMERIC.length),
    );
  }
  return result;
}

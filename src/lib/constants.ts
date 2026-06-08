// ============================================================
// SI-Mliwis — Konstanta Aplikasi
// ============================================================

// --- Informasi Aplikasi ---
export const APP_NAME = 'SI-Mliwis';
export const APP_DESCRIPTION =
  'Sistem Informasi Manajemen Pantai Mliwis - Kebumen';

// --- Jenis Kas ---
export const JENIS_KAS_MASUK = [
  'Jasa Penitipan',
  'Sewa Pendopo',
  'Sewa Camping Ground',
  'Iuran Mitra Usaha',
  'Kerjasama Sponsorship',
  'Pendapatan Lain-lain',
] as const;

export const JENIS_KAS_KELUAR = [
  'Gaji/Honor Pengelola',
  'Kebersihan Pantai',
  'Perawatan Fasilitas',
  'Pembelian Peralatan',
  'Pembayaran Listrik',
  'Konsumsi Kegiatan',
  'Pengeluaran Lain-lain',
] as const;

// --- Status Booking ---
export const STATUS_BOOKING = {
  MENUNGGU: 'menunggu',
  DISETUJUI: 'disetujui',
  DITOLAK: 'ditolak',
} as const;

export type StatusBooking =
  (typeof STATUS_BOOKING)[keyof typeof STATUS_BOOKING];

// --- Status Program Kerja ---
export const STATUS_PROGRAM_KERJA = [
  'Rencana',
  'Berjalan',
  'Selesai',
] as const;

export type StatusProgramKerja = (typeof STATUS_PROGRAM_KERJA)[number];

// --- Upload / File ---
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
] as const;

export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.heic',
  '.heif',
  '.webp',
  '.gif',
  '.svg',
  '.bmp',
  '.tiff',
] as const;

/** 10 MB dalam byte */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// --- Paginasi ---
export const ITEMS_PER_PAGE = 10;

// --- Navigasi Sidebar ---
export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  subItems?: NavSubItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    icon: 'LayoutDashboard',
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: 'Mail',
    label: 'Arsip Surat',
    href: '/arsip-surat',
    subItems: [
      { label: 'Surat Masuk', href: '/arsip-surat/masuk' },
      { label: 'Surat Keluar', href: '/arsip-surat/keluar' },
    ],
  },
  {
    icon: 'CalendarCheck',
    label: 'Booking',
    href: '/booking-admin',
    subItems: [
      { label: 'Data Booking', href: '/booking-admin' },
      { label: 'Validasi Booking', href: '/booking-admin/validasi' },
    ],
  },
  {
    icon: 'Wallet',
    label: 'Transaksi',
    href: '/transaksi',
    subItems: [
      { label: 'Kas Masuk', href: '/transaksi/kas-masuk' },
      { label: 'Kas Keluar', href: '/transaksi/kas-keluar' },
    ],
  },
  {
    icon: 'FileText',
    label: 'Laporan',
    href: '/laporan',
    subItems: [
      { label: 'Pengunjung', href: '/laporan/pengunjung' },
      { label: 'Transaksi', href: '/laporan/transaksi' },
    ],
  },
  {
    icon: 'ClipboardList',
    label: 'Program Kerja',
    href: '/program-kerja',
  },
  {
    icon: 'Newspaper',
    label: 'Berita',
    href: '/berita-admin',
  },
  {
    icon: 'Settings',
    label: 'Pengaturan',
    href: '/pengaturan',
  },
];

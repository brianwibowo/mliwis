// ============================================================
// SI-Mliwis — Konstanta Aplikasi
// ============================================================

// --- Informasi Aplikasi ---
export const APP_NAME = 'SI-Mliwis';
export const APP_DESCRIPTION =
  'Sistem Informasi Manajemen Pantai Mliwis - Kebumen';

// --- Jenis Kas ---
export const JENIS_KAS_MASUK = [
  'Tiket Masuk Wisata',
  'Sewa Gazebo/Tempat Duduk',
  'Sewa Camping Ground',
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

// --- Upload / File ---
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/heif',
] as const;

export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.heic',
  '.heif',
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
    label: 'Keuangan',
    href: '/keuangan',
    subItems: [
      { label: 'Kas Masuk', href: '/keuangan/kas-masuk' },
      { label: 'Kas Keluar', href: '/keuangan/kas-keluar' },
    ],
  },
  {
    icon: 'Users',
    label: 'Pengunjung',
    href: '/pengunjung',
  },
  {
    icon: 'FileText',
    label: 'Laporan',
    href: '/laporan',
  },
  {
    icon: 'Settings',
    label: 'Pengaturan',
    href: '/pengaturan',
  },
];

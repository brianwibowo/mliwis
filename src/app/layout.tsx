import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/hooks/useToast'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SI-Mliwis | Sistem Informasi Manajemen Pantai Mliwis',
    template: '%s | SI-Mliwis',
  },
  description: 'Sistem Informasi Manajemen Pantai Mliwis - Kebumen. Kelola arsip surat, booking acara, keuangan, data pengunjung, dan laporan.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}

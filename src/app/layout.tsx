import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/hooks/useToast'

const poppinsHeading = Poppins({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const poppinsBody = Poppins({
  weight: ['300', '400', '500', '600'],
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
    <html lang="id" className={`${poppinsHeading.variable} ${poppinsBody.variable}`}>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}

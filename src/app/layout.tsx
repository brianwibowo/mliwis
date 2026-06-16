import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/hooks/useToast'
import { SpeedInsights } from "@vercel/speed-insights/next"

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
    <html lang="id">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}

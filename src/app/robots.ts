import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pantaimliwis.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/login',
        '/dashboard/',
        '/transaksi/',
        '/profil/',
        '/pengaturan/',
        '/booking-admin/',
        '/arsip-surat/',
        '/laporan/',
        '/program-kerja/',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

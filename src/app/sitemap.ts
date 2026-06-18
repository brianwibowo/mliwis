import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { LIST_FASILITAS, LIST_KULINER } from '@/lib/data-landing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pantaimliwis.com'

  // 1. Static Pages
  const staticRoutes = [
    '',
    '/tentang-mliwis',
    '/booking',
    '/kuliner',
    '/fasilitas',
    '/berita-kegiatan',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Dynamic Culinary Routes
  const culinaryRoutes = LIST_KULINER.map((item) => ({
    url: `${baseUrl}/kuliner/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // 3. Dynamic Facility Routes
  const facilityRoutes = LIST_FASILITAS.map((item) => ({
    url: `${baseUrl}/fasilitas/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // 4. Dynamic News Routes (from Database)
  let newsRoutes: MetadataRoute.Sitemap = []
  try {
    const publishedNews = await prisma.berita.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })

    newsRoutes = publishedNews.map((news) => ({
      url: `${baseUrl}/berita-kegiatan/${news.slug}`,
      lastModified: news.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (err) {
    console.error('Error generating dynamic news sitemap:', err)
  }

  return [...staticRoutes, ...culinaryRoutes, ...facilityRoutes, ...newsRoutes]
}

export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import HomeClient from '@/app/HomeClient'

export default async function Page() {
  const beritaList = await prisma.berita.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  // Safe serialization for Client Component transfer
  const serializableNews = beritaList.map((news) => ({
    id: news.id,
    judul: news.judul,
    slug: news.slug,
    ringkasan: news.ringkasan,
    gambarUtama: news.gambarUtama,
    kategori: news.kategori,
    penulis: news.penulis,
    createdAt: news.createdAt.toISOString(),
  }))

  return <HomeClient initialNews={serializableNews} />
}

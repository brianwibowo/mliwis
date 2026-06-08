export const dynamic = 'force-dynamic'

import { getLatestNews } from '@/app/berita-kegiatan/actions'
import HomeClient from '@/app/HomeClient'

export default async function Page() {
  // Fetch news using the safe server action
  const r = await getLatestNews(3)
  
  return <HomeClient initialNews={r.data} />
}

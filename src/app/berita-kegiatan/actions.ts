'use server'

import { prisma } from '@/lib/prisma'

// Premium mock fallback news if the remote database connection is down
const MOCK_NEWS = [
  {
    id: 901,
    judul: 'Festival Budaya Grebeg Rolasan Tarik Perhatian Ribuan Pengunjung',
    slug: 'festival-budaya-grebeg-rolasan-tarik-perhatian-ribuan-pengunjung',
    ringkasan: 'Arak-arakan gunungan hasil bumi raksasa menyusuri pesisir selatan sebagai bentuk rasa syukur warga Desa Kenoyojayan atas berkah melimpah.',
    gambarUtama: '/mliwis10.jpg',
    kategori: 'Budaya & Tradisi',
    penulis: 'Admin Pokdarwis',
    createdAt: '2026-06-05T08:00:00.000Z',
    konten: [
      { type: 'text', value: 'Arak-arakan gunungan hasil bumi raksasa menyusuri pesisir selatan Pantai Mliwis Kebumen sebagai bentuk rasa syukur warga Desa Kenoyojayan atas berkah melimpah yang mereka terima sepanjang tahun.' },
      { type: 'text', value: 'Ribuan pengunjung memadati lokasi festival sejak pagi hari untuk menyaksikan keunikan tradisi Grebeg Rolasan ini. Warga setempat menghias gunungan dengan berbagai sayuran, buah-buahan, serta aneka makanan tradisional.' }
    ]
  },
  {
    id: 902,
    judul: 'Aksi Peduli Lingkungan: Penanaman 1.000 Pohon Cemara Udang',
    slug: 'aksi-peduli-lingkungan-penanaman-1-000-pohon-cemara-udang',
    ringkasan: 'Bekerja sama dengan Karang Taruna, Pokdarwis menanam seribu bibit cemara udang baru guna memperluas area teduh di Pantai Mliwis.',
    gambarUtama: '/mliwis1.jpg',
    kategori: 'Lingkungan',
    penulis: 'Pengelola Lingkungan',
    createdAt: '2026-06-03T10:30:00.000Z',
    konten: [
      { type: 'text', value: 'Bekerja sama dengan Karang Taruna Desa Kenoyojayan, Pokdarwis Pantai Mliwis melakukan aksi penanaman seribu bibit pohon cemara udang baru.' },
      { type: 'text', value: 'Kegiatan ini bertujuan untuk mencegah abrasi air laut samudra hindia serta memperluas kawasan teduh yang menjadi daya tarik utama bagi para wisatawan.' }
    ]
  },
  {
    id: 903,
    judul: 'Wahana Baru Kolam Renang Anak & Penyewaan ATV Resmi Dibuka',
    slug: 'wahana-baru-kolam-renang-anak-penyewaan-atv-resmi-dibuka',
    ringkasan: 'Meningkatkan kenyamanan liburan keluarga, fasilitas kolam renang air tawar mini serta 10 unit motor ATV siap memanjakan para pengunjung.',
    gambarUtama: '/mobil pantai1.JPG',
    kategori: 'Wahana Wisata',
    penulis: 'Humas Mliwis',
    createdAt: '2026-05-28T14:15:00.000Z',
    konten: [
      { type: 'text', value: 'Guna meningkatkan kepuasan pengunjung, pengelola Pantai Mliwis secara resmi membuka wahana baru berupa kolam renang air tawar anak-anak.' },
      { type: 'text', value: 'Selain itu, tersedia pula 10 unit motor ATV tangguh yang siap disewa untuk menyusuri hamparan pasir hitam luas khas pantai selatan Kebumen.' }
    ]
  },
  {
    id: 904,
    judul: 'Sukses Gelar Outbound Corporate BUMN di Area Hutan Cemara',
    slug: 'sukses-gelar-outbound-corporate-bumn-di-area-hutan-cemara',
    ringkasan: 'Lebih dari 100 peserta mengikuti kegiatan team-building dan rapat koordinasi di Aula Terbuka Pendopo Mliwis dengan sirkulasi udara pesisir yang segar.',
    gambarUtama: '/pendopo 1.jpg',
    kategori: 'Kegiatan Acara',
    penulis: 'Admin Booking',
    createdAt: '2026-05-20T09:00:00.000Z',
    konten: [
      { type: 'text', value: 'Lebih dari 100 peserta mengikuti kegiatan outbound dan team building di Pantai Mliwis. Aula Pendopo yang sejuk serta rimbunnya hutan cemara menjadi arena utama yang ideal untuk koordinasi dan permainan kepemimpinan.' }
    ]
  }
]

export async function getLatestNews(limit?: number) {
  try {
    const beritaList = await prisma.berita.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    if (beritaList.length === 0) {
      return {
        success: true,
        data: MOCK_NEWS.slice(0, limit)
      }
    }

    return {
      success: true,
      data: beritaList.map((news) => ({
        id: news.id,
        judul: news.judul,
        slug: news.slug,
        ringkasan: news.ringkasan,
        gambarUtama: news.gambarUtama || '/mliwis10.jpg',
        kategori: news.kategori,
        penulis: news.penulis,
        createdAt: news.createdAt.toISOString(),
      }))
    }
  } catch (err: any) {
    console.error("Error loading news in server action:", err)
    return {
      success: false,
      error: 'Gagal memuat berita dari database. Menampilkan data cadangan.',
      data: MOCK_NEWS.slice(0, limit)
    }
  }
}

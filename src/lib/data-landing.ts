export interface FasilitasItem {
  slug: string
  title: string
  icon: string
  price: string
  description: string
  longDescription: string
  features: string[]
  images: string[]
}

export interface KulinerItem {
  slug: string
  title: string
  price: string
  description: string
  longDescription: string
  ingredients: string[]
  images: string[]
}

export const LIST_FASILITAS: FasilitasItem[] = [
  {
    slug: 'camping-ground',
    title: 'Area Camping Ground',
    icon: 'Tent',
    price: '',
    description: 'Merasakan sensasi berkemah di bawah rindangnya cemara udang dengan suara deburan ombak laut selatan yang menenangkan.',
    longDescription: 'Area Camping Ground Pantai Mliwis menawarkan pengalaman berkemah yang luar biasa di bawah keteduhan deretan pohon cemara udang. Dengan angin laut selatan yang sejuk dan suara ombak yang berirama sepanjang malam, tempat ini sangat cocok untuk melepaskan penat dari kesibukan perkotaan. Dilengkapi dengan fasilitas pendukung yang lengkap seperti kamar mandi yang bersih, stop kontak listrik, serta keamanan yang siaga untuk menjamin kenyamanan Anda.',
    features: [
      'Toilet & Shower yang bersih dan terawat',
      'Keamanan area camping terjamin',
      'Akses sangat dekat dengan bibir pantai',
      'Area khusus api unggun bersama keluarga'
    ],
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600',
      'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?q=80&w=600'
    ]
  },
  {
    slug: 'payung-pantai',
    title: 'Sewa Payung Pantai',
    icon: 'Umbrella',
    price: '',
    description: 'Payung teduh di sepanjang pantai untuk menikmati keindahan laut lepas dengan nyaman tanpa khawatir kepanasan.',
    longDescription: 'Sewa Payung Pantai disediakan bagi pengunjung yang ingin bersantai di tepi laut dengan tetap terlindung dari teriknya sinar matahari. Setiap payung dilengkapi dengan dua buah kursi santai yang nyaman, sangat pas untuk menikmati hembusan angin laut pesisir Kebumen bersama pasangan atau keluarga sambil memandang cakrawala lepas laut selatan.',
    features: [
      'Payung pelindung sinar UV berukuran lebar',
      'Sudah termasuk 2 kursi santai yang nyaman',
      'Peletakan fleksibel di dekat garis pantai',
      'Bisa disewa seharian penuh'
    ],
    images: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=600',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=600'
    ]
  },
  {
    slug: 'musola',
    title: 'Mushola Pantai',
    icon: 'Mosque',
    price: '',
    description: 'Fasilitas ibadah yang tenang, bersih, dan sejuk di sekitar kawasan wisata Pantai Mliwis.',
    longDescription: 'Mushola Pantai Mliwis dibangun demi menunjang kenyamanan beribadah para pengunjung muslim selama menghabiskan waktu liburan di pantai. Didesain dengan sirkulasi udara yang baik agar suasana di dalam tetap sejuk dan tenang, mushola ini senantiasa dijaga kebersihannya serta dilengkapi dengan fasilitas bersuci yang memadai.',
    features: [
      'Tempat wudu pria & wanita terpisah yang bersih',
      'Sajadah, mukena, dan sarung bersih tersedia',
      'Kapasitas hingga 20 jamaah sekaligus',
      'Lokasi strategis dekat pusat keramaian & toilet'
    ],
    images: [
      'https://images.unsplash.com/photo-1597935258735-e254c1839512?q=80&w=600',
      'https://images.unsplash.com/photo-1609137144813-91c69b5ae57?q=80&w=600'
    ]
  },
  {
    slug: 'aneka-kuliner',
    title: 'Pusat Aneka Kuliner',
    icon: 'Store',
    price: '',
    description: 'Kawasan kuliner yang menjajakan makanan laut segar dan hidangan tradisional khas pesisir Ambal Kebumen.',
    longDescription: 'Pusat Aneka Kuliner Pantai Mliwis merupakan surga makanan bagi para pecinta kuliner. Di sini, Anda dapat mencicipi hidangan legendaris khas seperti Sate Ambal dengan bumbu tempe yang manis gurih, emping melinjo yang renyah gurih, pecel pesisir segar, serta tempe mendoan hangat yang disajikan langsung dari penggorengan warga lokal Desa Kenoyojayan.',
    features: [
      'Menyajikan masakan khas daerah (Sate Ambal)',
      'Kelapa muda segar kupas langsung',
      'Area tempat duduk teduh di bawah cemara',
      'Harga bersahabat dan higienis'
    ],
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600'
    ]
  },
  {
    slug: 'pendopo',
    title: 'Pendopo / Aula Terbuka',
    icon: 'Building',
    price: '',
    description: 'Pendopo tradisional berkapasitas besar dengan sirkulasi udara pantai alami untuk acara formal maupun non-formal.',
    longDescription: 'Pendopo Pantai Mliwis merupakan bangunan aula terbuka bergaya arsitektur tradisional Jawa (Joglo) yang berukuran besar. Lokasi ini sering disewa untuk berbagai kebutuhan acara seperti rapat kerja organisasi, gathering keluarga besar, perayaan syukuran adat, hingga akad nikah dengan konsep luar ruangan (outdoor) berlatar belakang alam pesisir.',
    features: [
      'Kapasitas menampung hingga 150 tamu',
      'Sirkulasi udara sejuk pantai bebas pengap',
      'Stop kontak listrik yang cukup di sekeliling aula',
      'Dekat akses toilet utama dan parkiran luas'
    ],
    images: [
      'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=600',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600'
    ]
  },
  {
    slug: 'sewa-tikar',
    title: 'Sewa Tikar Piknik',
    icon: 'Grid',
    price: '',
    description: 'Tikar piknik praktis untuk berkumpul dan makan bersama keluarga di bawah naungan pohon cemara.',
    longDescription: 'Sewa Tikar Piknik sangat diminati oleh rombongan keluarga yang ingin menikmati makan siang bersama dengan gaya santai menggelar alas (lesehan). Anda bisa menggelar tikar ini di bawah barisan pohon cemara yang rindang, terlindung dari sinar matahari langsung, sembari mengawasi anak-anak bermain pasir pantai.',
    features: [
      'Bahan tikar plastik tebal anti-air',
      'Ukuran luas (cukup untuk 4-6 orang dewasa)',
      'Bebas menggelar di area teduh manapun',
      'Harga sewa sangat terjangkau seharian'
    ],
    images: [
      'https://images.unsplash.com/photo-1470246973918-29a93221c455?q=80&w=600'
    ]
  },
  {
    slug: 'kuda-pantai',
    title: 'Sewa Kuda Pantai',
    icon: 'Compass',
    price: '',
    description: 'Menyusuri keindahan garis pantai selatan dengan menunggangi kuda yang dipandu pawang berpengalaman.',
    longDescription: 'Sewa Kuda Pantai Mliwis memberikan pengalaman berwisata yang unik dan tak terlupakan. Anda dapat menunggangi kuda menyusuri garis pantai selatan yang panjang dengan hembusan angin samudra yang kencang. Setiap kuda didampingi secara penuh oleh pawang berpengalaman, sehingga sangat aman dicoba oleh orang dewasa maupun anak-anak.',
    features: [
      'Kuda sehat, terawat, dan berkarakter jinak',
      'Didampingi penuh oleh pemandu/pawang profesional',
      'Rute perjalanan menyusuri bibir pantai yang luas',
      'Spot foto sangat ikonik di atas kuda dengan latar pantai'
    ],
    images: [
      'https://images.unsplash.com/photo-1534067783941-51c9c23eccfd?q=80&w=600',
      'https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?q=80&w=600'
    ]
  },
  {
    slug: 'gazebo',
    title: 'Gazebo Pantai',
    icon: 'Building2',
    price: '',
    description: 'Pondok kayu santai menghadap ke arah laut selatan untuk berkumpul bersama keluarga.',
    longDescription: 'Gazebo Pantai Mliwis merupakan bangunan kayu berukuran sedang yang didesain tinggi dari permukaan pasir untuk memberikan pandangan terbaik ke laut lepas. Sangat nyaman digunakan sebagai tempat beristirahat sejenak setelah lelah beraktivitas di pantai, atau untuk bersantap kelapa muda sambil menikmati panorama ombak.',
    features: [
      'Bangunan kayu kelapa kokoh beratap jerami alami',
      'Menghadap langsung ke arah deburan ombak laut',
      'Colokan listrik tersedia di beberapa gazebo',
      'Sangat bersih dan berdekatan dengan area warung'
    ],
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600'
    ]
  },
  {
    slug: 'sewa-ayunan',
    title: 'Sewa & Area Ayunan',
    icon: 'Smile',
    price: '',
    description: 'Fasilitas ayunan gantung di bawah pepohonan cemara yang teduh, sangat disukai oleh anak-anak.',
    longDescription: 'Area Ayunan Pantai Mliwis menyediakan berbagai ayunan gantung yang terpasang kuat di antara batang pohon cemara yang besar. Menawarkan kesenangan sederhana bagi anak-anak dan spot santai yang menenangkan bagi orang dewasa yang ingin duduk berayun santai membaca buku atau mendengarkan musik di tengah alam.',
    features: [
      'Tali gantung dan papan ayunan kokoh & aman',
      'Terletak di bawah kerindangan pohon cemara yang sejuk',
      'Sangat disukai anak-anak untuk area bermain',
      'Tarif ramah kantong untuk penggunaan sepanjang hari'
    ],
    images: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=600'
    ]
  },
  {
    slug: 'parkir',
    title: 'Parkir Luas (Jasa Penitipan)',
    icon: 'Shield',
    price: 'Motor: Rp 3.000 | Mobil: Rp 5.000',
    description: 'Fasilitas area penitipan kendaraan yang sangat luas dan aman yang dikelola secara profesional.',
    longDescription: 'Jasa Penitipan Kendaraan (JPK) Pantai Mliwis dikelola oleh Pokdarwis desa dengan sistem parkir satu pintu. Area parkir yang disediakan sangat lapang, mampu menampung ratusan kendaraan roda dua, mobil pribadi, hingga bus pariwisata. Lokasi parkir teduh berkat barisan pohon rindang serta dijaga oleh petugas keamanan guna menjamin keselamatan kendaraan Anda.',
    features: [
      'Kapasitas parkir sangat luas untuk bus pariwisata',
      'Petugas parkir ramah dan sigap mengarahkan kendaraan',
      'Sistem karcis masuk resmi untuk keamanan ganda',
      'Tarif sangat terjangkau tanpa biaya tambahan per jam'
    ],
    images: [
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=600',
      'https://images.unsplash.com/photo-1473116763269-255448993f66?q=80&w=600'
    ]
  },
  {
    slug: 'kolam-renang-anak',
    title: 'Kolam Renang Anak',
    icon: 'Droplet',
    price: '',
    description: 'Kolam renang air tawar mini yang aman dan menyenangkan untuk anak-anak bermain air.',
    longDescription: 'Kolam Renang Anak Pantai Mliwis merupakan alternatif bagi orang tua yang khawatir membiarkan anak-anaknya berenang di laut selatan yang berombak besar. Kolam renang air tawar buatan ini didesain dangkal dan aman, lengkap dengan permainan air mini agar buah hati Anda tetap dapat bermain air dengan gembira dan aman di bawah pengawasan.',
    features: [
      'Kedalaman air yang pas untuk anak-anak (40 - 60 cm)',
      'Permainan seluncuran air mini dan air pancur',
      'Tempat duduk santai beratap bagi orang tua yang mengawasi',
      'Air tawar bersih yang disaring secara teratur'
    ],
    images: [
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600',
      'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=600'
    ]
  },
  {
    slug: 'atv-pantai',
    title: 'Sewa ATV Pantai',
    icon: 'Zap',
    price: '',
    description: 'Petualangan seru mengendarai motor ATV menyusuri hamparan pasir hitam selatan yang menantang.',
    longDescription: 'Sewa ATV Pantai Mliwis sangat cocok bagi pengunjung yang menyukai petualangan dan adrenalin. Anda dapat menyewa motor All-Terrain Vehicle (ATV) berkekuatan besar untuk melibas jalur pasir hitam yang luas di sepanjang pesisir Pantai Mliwis. Dapatkan sensasi berkendara yang menantang di atas medan pasir bergelombang.',
    features: [
      'Armada ATV tangguh dalam kondisi prima',
      'Diberikan instruksi berkendara singkat sebelum mulai',
      'Jalur lintasan pasir pantai yang lapang dan aman',
      'Dilengkapi dengan fasilitas helm pengaman'
    ],
    images: [
      'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=600',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600'
    ]
  },
  {
    slug: 'pohon-cemara',
    title: 'Hutan Cemara yang Sejuk',
    icon: 'TreePine',
    price: '',
    description: 'Kawasan hutan cemara udang yang rimbun, menyajikan keteduhan alami di sepanjang pesisir pantai.',
    longDescription: 'Hutan Cemara Pantai Mliwis adalah ciri khas utama destinasi wisata ini. Ribuan pohon cemara udang ditanam rapi membentuk kanopi hijau raksasa yang menapis sinar matahari langsung. Di bawah rindangnya pohon-pohon ini, udara terasa sangat sejuk, menjadikannya tempat ternyaman untuk berjalan-jalan santai, menggelar tikar, atau berburu foto estetis.',
    features: [
      'Kawasan hijau rimbun yang asri dan sejuk alami',
      'Banyak spot teduh untuk bersantai piknik lesehan',
      'Background foto bernuansa alam yang sangat estetik',
      'Udara sejuk bebas polusi'
    ],
    images: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600'
    ]
  }
]

export const LIST_KULINER: KulinerItem[] = [
  {
    slug: 'sate-ambal',
    title: 'Sate Ambal',
    price: '',
    description: 'Kuliner ayam kampung bakar legendaris khas Ambal dengan bumbu saus berbahan dasar tempe manis gurih.',
    longDescription: 'Sate Ambal merupakan salah satu ikon kuliner paling legendaris dari Kebumen. Sate ini dibuat menggunakan potongan daging ayam kampung pilihan yang telah dimarinasi dengan berbagai rempah tradisional sebelum dipanggang di atas bara arang kelapa. Keunikan utama Sate Ambal terletak pada bumbunya yang bukan menggunakan bumbu kacang biasa, melainkan bumbu berbahan dasar tempe rebus yang dihaluskan bersama bawang, gula jawa, dan rempah-rempah pilihan. Menghasilkan rasa gurih manis bertekstur lembut yang sangat memanjakan lidah.',
    ingredients: [
      'Daging ayam kampung segar bertekstur empuk',
      'Bumbu marinasi ketumbar, jintan, bawang putih, gula merah',
      'Saus khusus berbahan tempe halus pilihan khas Ambal',
      'Disajikan dengan ketupat janur tradisional'
    ],
    images: ['/sate-ambal-1.png', '/sate-ambal-2.png']
  },
  {
    slug: 'emping-melinjo',
    title: 'Emping Melinjo Kenoyojayan',
    price: '',
    description: 'Keripik melinjo renyah produksi swadaya warga Desa Kenoyojayan dengan aneka varian rasa.',
    longDescription: 'Emping Melinjo merupakan produk camilan andalan yang diproduksi secara tradisional oleh industri rumah tangga warga Desa Kenoyojayan. Menggunakan buah melinjo pilihan yang disangrai dengan pasir, lalu dipipihkan secara manual selagi panas. Camilan ini memiliki tekstur yang tipis dan sangat renyah. Di Pantai Mliwis, emping melinjo ditawarkan dengan berbagai varian rasa seperti gurih original asin, manis pedas, maupun manis legit, menjadikannya pilihan oleh-oleh favorit wisatawan.',
    ingredients: [
      'Biji melinjo tua pilihan hasil bumi lokal',
      'Minyak goreng berkualitas tinggi',
      'Bumbu tabur garam (original), cabai, atau gula jawa',
      'Tanpa pengawet buatan'
    ],
    images: ['/emping-melinjo-1.png', '/emping-melinjo-2.png']
  },
  {
    slug: 'pecel',
    title: 'Pecel Pesisir Mliwis',
    price: '',
    description: 'Kombinasi sayuran rebus segar yang disiram dengan saus kacang pedas khas pesisir pantai selatan.',
    longDescription: 'Pecel Pesisir Pantai Mliwis menawarkan kesegaran aneka sayur-sayuran rebus yang dipadukan dengan bumbu kacang tradisional khas Kebumen. Bumbu pecel di sini memiliki ciri khas rasa kencur dan jeruk purut yang harum menyengat dengan tingkat kepedasan yang pas. Biasa disajikan hangat dengan alas pincuk daun pisang, ditemani ketupat, rempeyek renyah, atau tempe mendoan panas.',
    ingredients: [
      'Sayur bayam, kangkung, taoge, kacang panjang segar',
      'Saus kacang giling tradisional beraroma kencur & jeruk purut',
      'Rempeyek teri/kacang garing sebagai pendamping',
      'Lontong atau nasi putih hangat'
    ],
    images: ['/pecel-1.png', '/pecel-2.png']
  },
  {
    slug: 'mendoan',
    title: 'Tempe Mendoan Hangat',
    price: '',
    description: 'Tempe tipis lebar khas Banyumasan dibalut tepung berbumbu gurih daun bawang, digoreng setengah matang.',
    longDescription: 'Mendoan merupakan camilan wajib yang tidak boleh dilewatkan saat bersantai di Pantai Mliwis. Terbuat dari tempe khusus yang tipis lebar, dicelupkan ke dalam adonan tepung beras yang dibumbui ketumbar, bawang putih, garam, serta rajangan daun bawang yang melimpah. Digoreng secara cepat di dalam minyak panas (setengah matang/mendo) dan disajikan panas-panas dari wajan bersama cocolan sambal kecap pedas manis.',
    ingredients: [
      'Tempe khusus mendoan yang tipis lebar',
      'Adonan tepung beras & tapioka renyah gurih',
      'Daun bawang segar rajangan halus',
      'Cocolan sambal kecap cabai rawit pedas manis'
    ],
    images: ['/mendoan-1.png', '/mendoan-2.png']
  }
]

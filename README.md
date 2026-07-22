# 🌊 SI-Mliwis — Sistem Informasi & Manajemen Pantai Mliwis, Kebumen

Web aplikasi manajemen pariwisata terpadu untuk **Pokdarwis Pantai Mliwis**, Kebumen, Jawa Tengah. Dibuat menggunakan **Next.js 16 App Router**, **Prisma ORM**, dan **Neon Serverless Postgres**.

---

## ⚡ Arsitektur Database Serverless (Neon Postgres)

Aplikasi web ini menggunakan **Neon Serverless Postgres** (Lokasi: **AWS Singapura / ap-southeast-1**) sebagai database utama.

### 💡 Kenapa Menggunakan Neon Serverless Postgres?
1. **Super Cepat (Low Latency):** Berada di Region Singapura (lokasi yang sama dengan Vercel Edge Serverless), menurunkan latensi query database dari 300ms menjadi **< 15ms**.
2. **Instant Auto-Wakeup (< 300ms):** Berbeda dengan platform lain yang melakukan *auto-pause* permanen, Neon Serverless akan **otomatis bangun sendiri dalam hitungan milidetik** saat wisatawan atau pengelola mengakses website.
3. **100% Gratis Selamanya (0 Rupiah):** Disediakan kapasitas 500MB gratis yang cukup untuk kebutuhan data Pokdarwis hingga **3 s.d. 5+ tahun ke depan**.
4. **Independen dari Server Hosting Expiration:** Tidak bergantung pada langganan Hostinger harian/tahunan yang dapat kedaluwarsa.

---

## 🛠️ Konfigurasi Environment (`.env`)

Untuk menyambungkan proyek ke Neon Postgres, atur variabel `DATABASE_URL` di file `.env` lokal maupun di Vercel Environment Variables:

```env
# Database — Neon Serverless Postgres (Singapura)
DATABASE_URL="postgresql://[USERNAME]:[PASSWORD]@[NEON_HOST].ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Auth Secret
BETTER_AUTH_SECRET="si-mliwis-pantai-kebumen-secret-key-2026"
BETTER_AUTH_URL="http://localhost:3000"

# Upload Limit (Client & Server Action)
UPLOAD_MAX_SIZE_MB=10
```

---

## 🚀 Perintah Dasar Pengembangan & Database

```bash
# 1. Jalankan Server Lokal
npm run dev

# 2. Sinkronkan Schema Prisma ke Neon Postgres
npx prisma db push

# 3. Buat Ulang Prisma Client
npx prisma generate

# 4. Verifikasi & Build Produksi
npm run build
```

---

## 🛡️ Fitur Proteksi & Pengolahan Berkas

- **Client-side Image Processing:** Foto resolusi tinggi (15MB-20MB) dari kamera HP atau iPhone (`.heic`/`.heif`) dikonversi ke JPEG dan dikompresi otomatis di browser pengelola maksimal `1600px` dan `< 1MB`.
- **Drag & Drop Upload:** Pengelola dapat menarik beberapa foto sekaligus ke dalam area dokumentasi Program Kerja.
- **Server Action Body Limit:** Dikonfigurasi `10MB` di `next.config.ts` untuk mencegah error HTTP 413 Payload Too Large.
- **Global Error Boundary:** Halaman [src/app/error.tsx](file:///Users/mymac/Documents/Codes/mliwis/src/app/error.tsx) dan [src/app/(pengelola)/error.tsx](file:///Users/mymac/Documents/Codes/mliwis/src/app/%28pengelola%29/error.tsx) menangkap runtime error secara aman.

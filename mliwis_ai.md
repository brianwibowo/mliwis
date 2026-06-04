# Rancangan Usecase Pantai Mliwis - Kebumen
Nama sistem: SI-Mliwis (Sistem Informasi Managemen Pantai Mliwis)

## A. Identitas Pengguna

No | Aktor | Deskripsi
---|---|---
1 | Pengelola | Mengelola seluruh sistem seperti arsip surat, booking, keuangan, dan laporan
2 | Customer | Melakukan booking acara/wisata melalui sistem

## B. Use Case Sistem

No | Nama Use Case | Aktor | Tujuan/Deskripsi
---|---|---|---
1 | Login Sistem | Pengelola | Masuk ke dalam sistem menggunakan akun
2 | Kelola Surat Masuk | Pengelola | Menambah, mengubah, dan menghapus data surat masuk
3 | Kelola Surat Keluar | Pengelola | Mengelola data surat keluar
4 | Upload Arsip Surat | Pengelola | Mengunggah file dokumen surat
5 | Cari Arsip Surat | Pengelola | Mencari data surat berdasarkan kategori tertentu
6 | Kelola Booking Acara | Pengelola | Mengelola data booking customer
7 | Validasi Booking | Pengelola | Menyetujui atau menolak booking
8 | Lihat Jadwal Booking | Pengelola | Melihat jadwal acara yang sudah dibooking
9 | Input Kas Masuk | Pengelola | Menambahkan data pemasukan
10 | Input Kas Keluar | Pengelola | Menambahkan data pengeluaran
11 | Edit/Hapus Data Keuangan | Pengelola | Mengubah atau menghapus transaksi
12 | Input Jumlah Pengunjung | Pengelola | Menginput jumlah pengunjung harian
13 | Lihat Data Pengunjung | Pengelola | Melihat data jumlah pengunjung
14 | Rekap Pengunjung | Pengelola | Melihat rekap pengunjung mingguan/bulanan
15 | Lihat Rekap Mingguan | Pengelola | Menampilkan laporan mingguan
16 | Lihat Rekap Bulanan | Pengelola | Menampilkan laporan bulanan
17 | Cetak Laporan PDF | Pengelola | Mengunduh laporan dalam format PDF
18 | Logout Sistem | Pengelola | Keluar dari sistem
19 | Isi Form Booking | Customer | Melakukan pemesanan acara
20 | Lihat Status Booking | Customer | Melihat status booking diterima atau ditolak

## C. Relasi

No | Use Case Utama | Jenis Relasi | Use Case Pendukung
---|---|---|---
1 | Kelola Surat Masuk | | Upload Arsip Surat
2 | Kelola Surat Keluar | | Upload Arsip Surat
3 | Kelola Booking Acara | | Validasi Booking
4 | Rekap Pengunjung | | Cetak Laporan PDF
5 | Lihat Rekap Mingguan | | Cetak Laporan PDF
6 | Lihat Rekap Bulanan | | Cetak Laporan PDF

## D. Hak Akses

Fitur Sistem | Pengelola | Customer
---|---|---
Login Sistem ✓ | | 
Arsip Surat ✓ | | 
Booking Acara ✓ | | ✓
Validasi Booking ✓ | | 
Keuangan ✓ | | 
Data Pengunjung ✓ | | 
Cetak Laporan PDF ✓ | | 
Lihat Status Booking✓ | | ✓

## E. Kebutuhan Rincian

Modul | Data yang Dikelola
---|---
Surat Menyurat | Nomor surat, tanggal, pengirim, tujuan, perihal, file surat
Booking Acara | Nama customer, fasilitas yg di booking, tanggal acara, jenis acara, nomor HP
Keuangan | Tanggal transaksi, jenis transaksi, nominal, keterangan
Pengunjung | Tanggal kunjungan, jumlah pengunjung
Laporan | Rekap mingguan dan bulanan dalam PDF

## F. Menu Pengelola dan Pengunjung
### 1. Menu Pengelola

Menu Utama | Sub Menu
---|---
Dashboard | Statistik sistem
Arsip Surat | Surat masuk, surat keluar
Booking | Data booking, validasi booking
Keuangan | Kas masuk, kas keluar
Pengunjung | Input pengunjung, data pengunjung
Laporan | Rekap mingguan, bulanan, cetak PDF
Logout | Keluar sistem

### 2. Menu Customer

Menu Utama | Sub Menu
---|---
Booking Acara | Form booking

Status Booking Cek status booking

## G. Jenis Transaksi
### 1. Kas Masuk

No | Jenis Transaksi
---|---
1 | Jasa Penitipan
2 | Sewa Pendopo
3 | Sewa Camping Ground
4 | Iuran Mitra Usaha
5 | Kerjasama Sponsorship
6 | Pendapatan Lain-lain (ada isian)

### 2. Kas Keluar

No | Jenis Transaksi | Keterangan
---|---|---
1 | Gaji/Honor Pengelola | 
2 | Kebersihan Pantai | 
3 | Perawatan Fasilitas | 
4 | Pembelian Peralatan | 
5 | Pembayaran Listrik | 
6 | Konsumsi Kegiatan | 
7 | Pengeluaran Lain-lain | (ada isian)

## H. Fasilitas Booking

Fasilitas | Deskripsi
---|---
Area Camping Ground | Tempat camping peserta
Area Outbound | Tempat kegiatan permainan/outbound
Pendopo/ Aula Terbuka | Tempat acara resmi
Area Prewedding | Lokasi foto prewedding
Area UMKM | Tempat bazar/penjualan
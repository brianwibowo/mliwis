-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'staff',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `surat_masuk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomorSurat` VARCHAR(191) NOT NULL,
    `tanggalSurat` DATETIME(3) NOT NULL,
    `pengirim` VARCHAR(191) NOT NULL,
    `tujuan` VARCHAR(191) NOT NULL,
    `perihal` TEXT NOT NULL,
    `filePath` VARCHAR(191) NULL,
    `namaFile` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `surat_masuk_tanggalSurat_idx`(`tanggalSurat`),
    INDEX `surat_masuk_nomorSurat_idx`(`nomorSurat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `surat_keluar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomorSurat` VARCHAR(191) NOT NULL,
    `tanggalSurat` DATETIME(3) NOT NULL,
    `pengirim` VARCHAR(191) NOT NULL,
    `tujuan` VARCHAR(191) NOT NULL,
    `perihal` TEXT NOT NULL,
    `filePath` VARCHAR(191) NULL,
    `namaFile` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `surat_keluar_tanggalSurat_idx`(`tanggalSurat`),
    INDEX `surat_keluar_nomorSurat_idx`(`nomorSurat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fasilitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bookings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kodeBooking` VARCHAR(191) NOT NULL,
    `namaCustomer` VARCHAR(191) NOT NULL,
    `nomorHP` VARCHAR(191) NOT NULL,
    `tanggalMulai` DATETIME(3) NOT NULL,
    `tanggalSelesai` DATETIME(3) NOT NULL,
    `jenisAcara` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'menunggu',
    `catatanPengelola` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bookings_kodeBooking_key`(`kodeBooking`),
    INDEX `bookings_status_idx`(`status`),
    INDEX `bookings_tanggalMulai_idx`(`tanggalMulai`),
    INDEX `bookings_kodeBooking_idx`(`kodeBooking`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_fasilitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `fasilitasId` INTEGER NOT NULL,

    UNIQUE INDEX `booking_fasilitas_bookingId_fasilitasId_key`(`bookingId`, `fasilitasId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kas_masuk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL,
    `jenisTransaksi` VARCHAR(191) NOT NULL,
    `keteranganLain` VARCHAR(191) NULL,
    `nominal` DECIMAL(15, 2) NOT NULL,
    `keterangan` TEXT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `kas_masuk_tanggal_idx`(`tanggal`),
    INDEX `kas_masuk_jenisTransaksi_idx`(`jenisTransaksi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kas_keluar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL,
    `jenisTransaksi` VARCHAR(191) NOT NULL,
    `keteranganLain` VARCHAR(191) NULL,
    `nominal` DECIMAL(15, 2) NOT NULL,
    `keterangan` TEXT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `kas_keluar_tanggal_idx`(`tanggal`),
    INDEX `kas_keluar_jenisTransaksi_idx`(`jenisTransaksi`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengunjung` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME(3) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `pengunjung_tanggal_key`(`tanggal`),
    INDEX `pengunjung_tanggal_idx`(`tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `surat_masuk` ADD CONSTRAINT `surat_masuk_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `surat_keluar` ADD CONSTRAINT `surat_keluar_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_fasilitas` ADD CONSTRAINT `booking_fasilitas_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_fasilitas` ADD CONSTRAINT `booking_fasilitas_fasilitasId_fkey` FOREIGN KEY (`fasilitasId`) REFERENCES `fasilitas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kas_masuk` ADD CONSTRAINT `kas_masuk_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kas_keluar` ADD CONSTRAINT `kas_keluar_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengunjung` ADD CONSTRAINT `pengunjung_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

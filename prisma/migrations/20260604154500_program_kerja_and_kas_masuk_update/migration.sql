-- CreateTable
CREATE TABLE `program_kerja` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaKegiatan` VARCHAR(191) NOT NULL,
    `tanggalKegiatan` DATETIME(3) NOT NULL,
    `jumlahDana` DECIMAL(15, 2) NOT NULL,
    `sumberDana` VARCHAR(191) NOT NULL,
    `statusKegiatan` VARCHAR(191) NOT NULL DEFAULT 'Rencana',
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `program_kerja_tanggalKegiatan_idx`(`tanggalKegiatan`),
    INDEX `program_kerja_statusKegiatan_idx`(`statusKegiatan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `program_kerja_dokumentasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `programKerjaId` INTEGER NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `namaFile` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `program_kerja_dokumentasi_programKerjaId_idx`(`programKerjaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `program_kerja` ADD CONSTRAINT `program_kerja_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `program_kerja_dokumentasi` ADD CONSTRAINT `program_kerja_dokumentasi_programKerjaId_fkey` FOREIGN KEY (`programKerjaId`) REFERENCES `program_kerja`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- MigrateData: Rename jenis transaksi kas masuk
UPDATE `kas_masuk` SET `jenisTransaksi` = 'Jasa Penitipan' WHERE `jenisTransaksi` = 'Tiket Masuk Wisata';
UPDATE `kas_masuk` SET `jenisTransaksi` = 'Sewa Pendopo' WHERE `jenisTransaksi` = 'Sewa Gazebo/Tempat Duduk';

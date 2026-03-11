-- DropForeignKey
ALTER TABLE `kosfacility` DROP FOREIGN KEY `KosFacility_kos_id_fkey`;

-- AddForeignKey
ALTER TABLE `KosFacility` ADD CONSTRAINT `KosFacility_kos_id_fkey` FOREIGN KEY (`kos_id`) REFERENCES `Kos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

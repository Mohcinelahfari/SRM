/*
  Warnings:

  - You are about to drop the column `createdAt` on the `employee` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employee` DROP COLUMN `createdAt`,
    DROP COLUMN `password`,
    ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

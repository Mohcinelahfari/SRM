/*
  Warnings:

  - You are about to drop the column `userId` on the `employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `employee` DROP FOREIGN KEY `Employee_userId_fkey`;

-- DropIndex
DROP INDEX `Employee_userId_fkey` ON `employee`;

-- AlterTable
ALTER TABLE `employee` DROP COLUMN `userId`,
    ADD COLUMN `isAdmin` BOOLEAN NULL DEFAULT false;

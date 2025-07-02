/*
  Warnings:

  - Added the required column `datedebut` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employee` ADD COLUMN `datedebut` DATETIME(3) NOT NULL;

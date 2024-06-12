/*
  Warnings:

  - You are about to drop the column `role` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `article` MODIFY `content` MEDIUMTEXT NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `role`,
    ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `comment` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `updatedAt` DROP DEFAULT;

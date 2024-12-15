/*
  Warnings:

  - You are about to drop the column `connectAccountId` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `goal` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `connectAccountId` on the `SubAccount` table. All the data in the column will be lost.
  - You are about to drop the column `goal` on the `SubAccount` table. All the data in the column will be lost.
  - You are about to drop the `AddOns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "connectAccountId",
DROP COLUMN "customerId",
DROP COLUMN "goal";

-- AlterTable
ALTER TABLE "SubAccount" DROP COLUMN "connectAccountId",
DROP COLUMN "goal";

-- DropTable
DROP TABLE "AddOns";

-- DropTable
DROP TABLE "Subscription";

-- DropEnum
DROP TYPE "Plan";

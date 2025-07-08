-- AlterTable
ALTER TABLE "League" ADD COLUMN     "currentPick" INTEGER,
ADD COLUMN     "draftOrder" TEXT[],
ADD COLUMN     "draftStarted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "MachineCategoryTranslation" ADD COLUMN     "homeBullets" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "homeDescription" TEXT,
ADD COLUMN     "homeHeading" VARCHAR(400);

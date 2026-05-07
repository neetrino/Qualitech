-- Optional image list for the product specifications block (separate from gallery images).
ALTER TABLE "Machine"
ADD COLUMN "excelImageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

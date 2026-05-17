ALTER TABLE "MachineTranslation"
ADD COLUMN "excelUrl" TEXT,
ADD COLUMN "excelImageUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

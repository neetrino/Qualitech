-- Catalog visibility: "published" = shown on /machines; "featured" = eligible for home #solutions cards.
ALTER TABLE "MachineCategory" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "MachineCategory" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- Preserve previous behaviour: all existing top-level sections stay on /machines and remain home candidates.
UPDATE "MachineCategory" SET "featured" = true WHERE "parentId" IS NULL;

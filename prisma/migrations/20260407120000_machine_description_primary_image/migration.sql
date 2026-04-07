-- MachineImage: primary hero / catalog cover
ALTER TABLE "MachineImage" ADD COLUMN "isPrimary" BOOLEAN NOT NULL DEFAULT false;

UPDATE "MachineImage" AS mi
SET "isPrimary" = true
FROM (
  SELECT id
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY "machineId"
        ORDER BY "sortOrder" ASC, "createdAt" ASC
      ) AS rn
    FROM "MachineImage"
  ) ranked
  WHERE ranked.rn = 1
) AS first_per_machine
WHERE mi.id = first_per_machine.id;

-- MachineTranslation: single rich description (from legacy body)
ALTER TABLE "MachineTranslation" ADD COLUMN "description" TEXT;

UPDATE "MachineTranslation" SET "description" = "body" WHERE "description" IS NULL;

ALTER TABLE "MachineTranslation" ALTER COLUMN "description" SET NOT NULL;

ALTER TABLE "MachineTranslation" DROP COLUMN "shortDescription";
ALTER TABLE "MachineTranslation" DROP COLUMN "body";

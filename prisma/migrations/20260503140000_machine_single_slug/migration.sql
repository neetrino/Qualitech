-- Single public URL slug per machine (shared across locales).

ALTER TABLE "Machine" ADD COLUMN "slug" TEXT;

UPDATE "Machine" m
SET "slug" = sub.chosen
FROM (
  SELECT
    "machineId",
    COALESCE(
      MAX(CASE WHEN locale = 'en'::"AppLocale" THEN slug END),
      MAX(slug)
    ) AS chosen
  FROM "MachineTranslation"
  GROUP BY "machineId"
) AS sub
WHERE m.id = sub."machineId";

UPDATE "Machine"
SET "slug" = id
WHERE "slug" IS NULL OR btrim("slug") = '';

WITH numbered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "slug" ORDER BY id) AS rn
  FROM "Machine"
)
UPDATE "Machine" m
SET "slug" = left(m."slug" || '-' || m.id, 200)
FROM numbered n
WHERE m.id = n.id AND n.rn > 1;

ALTER TABLE "Machine" ALTER COLUMN "slug" SET NOT NULL;

DROP INDEX "MachineTranslation_locale_slug_key";

ALTER TABLE "MachineTranslation" DROP COLUMN "slug";

CREATE UNIQUE INDEX "Machine_slug_key" ON "Machine"("slug");

CREATE UNIQUE INDEX "MachineTranslation_machineId_locale_key" ON "MachineTranslation"("machineId", "locale");

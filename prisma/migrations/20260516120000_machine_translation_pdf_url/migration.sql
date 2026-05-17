-- Per-locale product sheet image (legacy shared value lives on Machine.pdfUrl).
ALTER TABLE "MachineTranslation" ADD COLUMN "pdfUrl" TEXT;

UPDATE "MachineTranslation" AS t
SET "pdfUrl" = m."pdfUrl"
FROM "Machine" AS m
WHERE t."machineId" = m.id
  AND m."pdfUrl" IS NOT NULL
  AND TRIM(m."pdfUrl") <> ''
  AND (t."pdfUrl" IS NULL OR TRIM(t."pdfUrl") = '');

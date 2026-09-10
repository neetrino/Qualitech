ALTER TABLE "ContactMessage"
ADD COLUMN "phone" TEXT;

UPDATE "ContactMessage"
SET "phone" = ''
WHERE "phone" IS NULL;

ALTER TABLE "ContactMessage"
ALTER COLUMN "phone" SET NOT NULL;

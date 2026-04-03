-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ContactMessage_idempotencyKey_key" ON "ContactMessage"("idempotencyKey");

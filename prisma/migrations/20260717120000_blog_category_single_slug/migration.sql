-- Single public URL slug per machine category and blog post (shared across locales).

-- ---------------------------------------------------------------------------
-- MachineCategory
-- ---------------------------------------------------------------------------

ALTER TABLE "MachineCategory" ADD COLUMN "slug" TEXT;

UPDATE "MachineCategory" c
SET "slug" = sub.chosen
FROM (
  SELECT
    "categoryId",
    COALESCE(
      MAX(CASE WHEN locale = 'en'::"AppLocale" THEN slug END),
      MAX(slug)
    ) AS chosen
  FROM "MachineCategoryTranslation"
  GROUP BY "categoryId"
) AS sub
WHERE c.id = sub."categoryId";

UPDATE "MachineCategory"
SET "slug" = id
WHERE "slug" IS NULL OR btrim("slug") = '';

WITH numbered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "slug" ORDER BY id) AS rn
  FROM "MachineCategory"
)
UPDATE "MachineCategory" c
SET "slug" = left(c."slug" || '-' || c.id, 200)
FROM numbered n
WHERE c.id = n.id AND n.rn > 1;

ALTER TABLE "MachineCategory" ALTER COLUMN "slug" SET NOT NULL;

DROP INDEX "MachineCategoryTranslation_locale_slug_key";

ALTER TABLE "MachineCategoryTranslation" DROP COLUMN "slug";

CREATE UNIQUE INDEX "MachineCategory_slug_key" ON "MachineCategory"("slug");

CREATE UNIQUE INDEX "MachineCategoryTranslation_categoryId_locale_key" ON "MachineCategoryTranslation"("categoryId", "locale");

-- ---------------------------------------------------------------------------
-- BlogPost
-- ---------------------------------------------------------------------------

ALTER TABLE "BlogPost" ADD COLUMN "slug" TEXT;

UPDATE "BlogPost" p
SET "slug" = sub.chosen
FROM (
  SELECT
    "postId",
    COALESCE(
      MAX(CASE WHEN locale = 'en'::"AppLocale" THEN slug END),
      MAX(slug)
    ) AS chosen
  FROM "BlogPostTranslation"
  GROUP BY "postId"
) AS sub
WHERE p.id = sub."postId";

UPDATE "BlogPost"
SET "slug" = id
WHERE "slug" IS NULL OR btrim("slug") = '';

WITH numbered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY "slug" ORDER BY id) AS rn
  FROM "BlogPost"
)
UPDATE "BlogPost" p
SET "slug" = left(p."slug" || '-' || p.id, 200)
FROM numbered n
WHERE p.id = n.id AND n.rn > 1;

ALTER TABLE "BlogPost" ALTER COLUMN "slug" SET NOT NULL;

DROP INDEX "BlogPostTranslation_locale_slug_key";

ALTER TABLE "BlogPostTranslation" DROP COLUMN "slug";

CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

CREATE UNIQUE INDEX "BlogPostTranslation_postId_locale_key" ON "BlogPostTranslation"("postId", "locale");

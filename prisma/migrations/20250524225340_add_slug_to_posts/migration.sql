-- 1. Add the slug column as nullable
ALTER TABLE "Post" ADD COLUMN "slug" TEXT;

-- 2. Update existing posts with slugs based on their titles
UPDATE "Post" 
SET "slug" = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '''', ''), '"', ''));

-- 3. Make the slug column required and unique
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
-- SQLite does not support ALTER COLUMN SET NOT NULL directly, but Prisma will enforce it at the schema level.
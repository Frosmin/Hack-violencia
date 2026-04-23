ALTER TABLE "Organization"
ADD COLUMN "joinCode" TEXT;

UPDATE "Organization"
SET "joinCode" = UPPER(SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8))
WHERE "joinCode" IS NULL;

ALTER TABLE "Organization"
ALTER COLUMN "joinCode" SET NOT NULL;

CREATE UNIQUE INDEX "Organization_joinCode_key" ON "Organization"("joinCode");

ALTER TABLE "Evidence"
ADD COLUMN "organizationId" INTEGER;

ALTER TABLE "Evidence"
ADD CONSTRAINT "Evidence_organizationId_fkey"
FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

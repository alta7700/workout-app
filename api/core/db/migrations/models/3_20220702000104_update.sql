-- upgrade --
ALTER TABLE "workout" ADD "comment" VARCHAR(200) NOT NULL;
ALTER TABLE "workout" ADD "random_key" VARCHAR(50) NOT NULL;
-- downgrade --
ALTER TABLE "workout" DROP COLUMN "comment";
ALTER TABLE "workout" DROP COLUMN "random_key";

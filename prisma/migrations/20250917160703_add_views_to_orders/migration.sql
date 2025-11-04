-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."specialist_profiles" ADD COLUMN     "subscriptionPlan" TEXT DEFAULT 'Basic',
ADD COLUMN     "subscriptionValidUntil" TIMESTAMP(3);

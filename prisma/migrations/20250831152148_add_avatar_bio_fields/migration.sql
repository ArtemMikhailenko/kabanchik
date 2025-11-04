/*
  Warnings:

  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "bio" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "public"."posts";

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" DECIMAL(65,30),
    "location" TEXT,
    "categoryId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "specialistId" TEXT,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_responses" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."specialist_profiles" (
    "id" TEXT NOT NULL,
    "proId" TEXT NOT NULL,
    "bio" TEXT,
    "skills" TEXT[],
    "categories" TEXT[],
    "hourlyRate" DECIMAL(65,30),
    "availability" TEXT,
    "portfolio" TEXT[],
    "rating" DECIMAL(65,30) DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "specialist_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "order_responses_orderId_specialistId_key" ON "public"."order_responses"("orderId", "specialistId");

-- CreateIndex
CREATE UNIQUE INDEX "specialist_profiles_proId_key" ON "public"."specialist_profiles"("proId");

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "public"."pros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_responses" ADD CONSTRAINT "order_responses_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_responses" ADD CONSTRAINT "order_responses_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "public"."pros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."specialist_profiles" ADD CONSTRAINT "specialist_profiles_proId_fkey" FOREIGN KEY ("proId") REFERENCES "public"."pros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

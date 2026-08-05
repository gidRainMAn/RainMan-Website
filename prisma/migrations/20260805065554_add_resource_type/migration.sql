-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('BLOG', 'CASE_STUDY', 'WHITEPAPER');

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "type" "ResourceType" NOT NULL DEFAULT 'BLOG';

-- CreateEnum
CREATE TYPE "LoginMethodType" AS ENUM ('EMAIL', 'GOOGLE', 'FACEBOOK', 'TWITTER');

-- CreateTable
CREATE TABLE "LoginMethod" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "method" "LoginMethodType" NOT NULL,
    "key" VARCHAR(63) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_id" ON "LoginMethod"("user_id");

-- CreateIndex
CREATE INDEX "method" ON "LoginMethod"("method");

-- CreateIndex
CREATE INDEX "key" ON "LoginMethod"("key");

-- AddForeignKey
ALTER TABLE "LoginMethod" ADD CONSTRAINT "LoginMethod_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

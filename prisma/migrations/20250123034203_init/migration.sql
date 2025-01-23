-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(63) NOT NULL,
    "first_name" VARCHAR(63) NOT NULL,
    "last_name" VARCHAR(63) NOT NULL,
    "username" VARCHAR(63) NOT NULL,
    "password" VARCHAR(63) NOT NULL,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "email" ON "User"("email");

-- CreateIndex
CREATE INDEX "username" ON "User"("username");

-- CreateIndex
CREATE INDEX "created_at" ON "User"("created_at");

-- CreateIndex
CREATE INDEX "updated_at" ON "User"("updated_at");

-- CreateIndex
CREATE INDEX "id" ON "User"("id");

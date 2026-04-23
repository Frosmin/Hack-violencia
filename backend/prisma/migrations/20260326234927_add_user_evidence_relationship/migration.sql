-- CreateTable
CREATE TABLE "Evidence" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "Sujeto" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "PartCategory" AS ENUM ('switch', 'housing', 'plate');

-- CreateEnum
CREATE TYPE "SwitchType" AS ENUM ('LINEAR', 'TACTILE', 'CLICKY');

-- CreateTable
CREATE TABLE "Part" (
    "id" TEXT NOT NULL,
    "category" "PartCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "imageUrl" TEXT,
    "priceKrw" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Switch" (
    "partId" TEXT NOT NULL,
    "type" "SwitchType" NOT NULL,
    "actuationG" DOUBLE PRECISION NOT NULL,
    "bottomG" DOUBLE PRECISION NOT NULL,
    "topMat" TEXT NOT NULL,
    "bottomMat" TEXT NOT NULL,
    "stemMat" TEXT NOT NULL,
    "factoryLubed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Switch_pkey" PRIMARY KEY ("partId")
);

-- CreateTable
CREATE TABLE "Housing" (
    "partId" TEXT NOT NULL,
    "layoutPct" DOUBLE PRECISION NOT NULL,
    "material" TEXT NOT NULL,
    "mount" TEXT NOT NULL,
    "tiltDeg" DOUBLE PRECISION NOT NULL,
    "weightG" INTEGER NOT NULL,

    CONSTRAINT "Housing_pkey" PRIMARY KEY ("partId")
);

-- CreateTable
CREATE TABLE "Plate" (
    "partId" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "flexCut" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Plate_pkey" PRIMARY KEY ("partId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartTag" (
    "partId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "PartTag_pkey" PRIMARY KEY ("partId","tagId")
);

-- CreateIndex
CREATE INDEX "Part_category_idx" ON "Part"("category");

-- CreateIndex
CREATE INDEX "Part_manufacturer_idx" ON "Part"("manufacturer");

-- CreateIndex
CREATE INDEX "Switch_type_idx" ON "Switch"("type");

-- CreateIndex
CREATE INDEX "Switch_actuationG_idx" ON "Switch"("actuationG");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_kind_value_key" ON "Tag"("kind", "value");

-- CreateIndex
CREATE INDEX "PartTag_tagId_idx" ON "PartTag"("tagId");

-- AddForeignKey
ALTER TABLE "Switch" ADD CONSTRAINT "Switch_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Housing" ADD CONSTRAINT "Housing_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plate" ADD CONSTRAINT "Plate_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartTag" ADD CONSTRAINT "PartTag_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartTag" ADD CONSTRAINT "PartTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

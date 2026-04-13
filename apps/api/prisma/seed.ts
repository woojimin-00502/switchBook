import { PrismaClient } from '@prisma/client';

type SwitchType = 'LINEAR' | 'TACTILE' | 'CLICKY';

const prisma = new PrismaClient();

async function ensureTag(kind: string, value: string) {
  return prisma.tag.upsert({
    where: { kind_value: { kind, value } },
    update: {},
    create: { kind, value },
  });
}

async function createSwitch(input: {
  name: string;
  manufacturer: string;
  priceKrw: number;
  type: SwitchType;
  actuationG: number;
  bottomG: number;
  topMat: string;
  bottomMat: string;
  stemMat: string;
  factoryLubed: boolean;
  tagValues: string[];
}) {
  const part = await prisma.part.create({
    data: {
      category: 'switch',
      name: input.name,
      manufacturer: input.manufacturer,
      priceKrw: input.priceKrw,
      switch: {
        create: {
          type: input.type,
          actuationG: input.actuationG,
          bottomG: input.bottomG,
          topMat: input.topMat,
          bottomMat: input.bottomMat,
          stemMat: input.stemMat,
          factoryLubed: input.factoryLubed,
        },
      },
    },
  });
  for (const v of input.tagValues) {
    const tag = await ensureTag('feature', v);
    await prisma.partTag.create({ data: { partId: part.id, tagId: tag.id } });
  }
}

async function createHousing(input: {
  name: string;
  manufacturer: string;
  priceKrw: number;
  layoutPct: number;
  material: string;
  mount: string;
  tiltDeg: number;
  weightG: number;
}) {
  await prisma.part.create({
    data: {
      category: 'housing',
      name: input.name,
      manufacturer: input.manufacturer,
      priceKrw: input.priceKrw,
      housing: {
        create: {
          layoutPct: input.layoutPct,
          material: input.material,
          mount: input.mount,
          tiltDeg: input.tiltDeg,
          weightG: input.weightG,
        },
      },
    },
  });
}

async function main() {
  await prisma.partTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.switch.deleteMany();
  await prisma.housing.deleteMany();
  await prisma.plate.deleteMany();
  await prisma.part.deleteMany();

  await createSwitch({
    name: 'MX Red',
    manufacturer: 'Cherry',
    priceKrw: 1200,
    type: 'LINEAR',
    actuationG: 45,
    bottomG: 60,
    topMat: 'Nylon',
    bottomMat: 'Nylon',
    stemMat: 'POM',
    factoryLubed: false,
    tagValues: ['smooth', 'classic'],
  });
  await createSwitch({
    name: 'MX Brown',
    manufacturer: 'Cherry',
    priceKrw: 1200,
    type: 'TACTILE',
    actuationG: 45,
    bottomG: 60,
    topMat: 'Nylon',
    bottomMat: 'Nylon',
    stemMat: 'POM',
    factoryLubed: false,
    tagValues: ['classic'],
  });
  await createSwitch({
    name: 'MX Blue',
    manufacturer: 'Cherry',
    priceKrw: 1200,
    type: 'CLICKY',
    actuationG: 50,
    bottomG: 60,
    topMat: 'Nylon',
    bottomMat: 'Nylon',
    stemMat: 'POM',
    factoryLubed: false,
    tagValues: ['clicky'],
  });
  await createSwitch({
    name: 'Oil King',
    manufacturer: 'Gateron',
    priceKrw: 1500,
    type: 'LINEAR',
    actuationG: 55,
    bottomG: 65,
    topMat: 'Nylon',
    bottomMat: 'INK',
    stemMat: 'POM',
    factoryLubed: true,
    tagValues: ['smooth', 'thocky', 'lubed'],
  });
  await createSwitch({
    name: 'Holy Panda X',
    manufacturer: 'Drop',
    priceKrw: 1800,
    type: 'TACTILE',
    actuationG: 60,
    bottomG: 67,
    topMat: 'Polycarbonate',
    bottomMat: 'Nylon',
    stemMat: 'POM',
    factoryLubed: false,
    tagValues: ['tactile-bump', 'premium'],
  });
  await createSwitch({
    name: 'Silent Alpaca',
    manufacturer: 'Durock',
    priceKrw: 1700,
    type: 'LINEAR',
    actuationG: 62,
    bottomG: 67,
    topMat: 'Nylon',
    bottomMat: 'Nylon',
    stemMat: 'POM',
    factoryLubed: true,
    tagValues: ['silent', 'lubed'],
  });

  await createHousing({
    name: 'KBD75 V3',
    manufacturer: 'KBDFans',
    priceKrw: 240000,
    layoutPct: 75,
    material: 'Aluminum',
    mount: 'Top Mount',
    tiltDeg: 6.5,
    weightG: 1800,
  });
  await createHousing({
    name: 'Tofu60 2.0',
    manufacturer: 'KBDFans',
    priceKrw: 110000,
    layoutPct: 60,
    material: 'Aluminum',
    mount: 'Tray Mount',
    tiltDeg: 6,
    weightG: 1400,
  });

  console.log('🌱 Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

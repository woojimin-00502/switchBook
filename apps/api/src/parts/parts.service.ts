import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PartCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchPartsDto } from './dto/search-parts.dto';

@Injectable()
export class PartsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(dto: SearchPartsDto) {
    const where: Prisma.PartWhereInput = {};
    if (dto.category) where.category = dto.category;

    if (dto.type || dto.minG != null || dto.maxG != null) {
      where.switch = {
        is: {
          ...(dto.type ? { type: dto.type } : {}),
          ...(dto.minG != null || dto.maxG != null
            ? {
                actuationG: {
                  ...(dto.minG != null ? { gte: dto.minG } : {}),
                  ...(dto.maxG != null ? { lte: dto.maxG } : {}),
                },
              }
            : {}),
        },
      };
    }

    if (dto.tag) {
      where.tags = { some: { tag: { value: dto.tag } } };
    }

    const skip = (dto.page - 1) * dto.limit;
    const [total, rows] = await this.prisma.$transaction([
      this.prisma.part.count({ where }),
      this.prisma.part.findMany({
        where,
        skip,
        take: dto.limit,
        orderBy: { createdAt: 'desc' },
        include: { tags: { include: { tag: true } } },
      }),
    ]);

    return {
      total,
      page: dto.page,
      limit: dto.limit,
      data: rows.map((r) => ({
        id: r.id,
        category: r.category,
        name: r.name,
        manufacturer: r.manufacturer,
        imageUrl: r.imageUrl,
        priceKrw: r.priceKrw,
        tags: r.tags.map((t) => ({ kind: t.tag.kind, value: t.tag.value })),
      })),
    };
  }

  async getOne(category: PartCategory, id: string) {
    const part = await this.prisma.part.findFirst({
      where: { id, category },
      include: {
        switch: true,
        housing: true,
        plate: true,
        tags: { include: { tag: true } },
      },
    });
    if (!part) throw new NotFoundException('Part not found');

    const base = {
      id: part.id,
      category: part.category,
      name: part.name,
      manufacturer: part.manufacturer,
      imageUrl: part.imageUrl,
      priceKrw: part.priceKrw,
      tags: part.tags.map((t) => ({ kind: t.tag.kind, value: t.tag.value })),
    };

    if (category === 'switch' && part.switch) return { ...base, ...part.switch };
    if (category === 'housing' && part.housing) return { ...base, ...part.housing };
    if (category === 'plate' && part.plate) return { ...base, ...part.plate };
    return base;
  }
}

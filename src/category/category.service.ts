import { Injectable, NotFoundException } from '@nestjs/common';
import { generateSlug } from 'src/utils/generate-slug';
import { PrismaService } from './../prisma/prisma.service';
import { CategoryDto } from './dto/category.dto';
import { returnCategoryObject } from './return-category.object';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create() {
    return this.prisma.category.create({
      data: {
        name: '',
        slug: ' ',
      },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: returnCategoryObject,
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: returnCategoryObject,
    });
    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async findAll() {
    return this.prisma.category.findMany({ select: returnCategoryObject });
  }

  async update(id: number, dto: CategoryDto) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
      },
    });
  }

  async delete(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from './../common/guards/at.guard';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @UseGuards(AtGuard)
  async findById(@Param('id') id: number) {
    return this.categoryService.findOne(+id);
  }

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AtGuard)
  async create() {
    return this.categoryService.create();
  }

  @Patch(':id')
  @UseGuards(AtGuard)
  async update(@Param('id') id: number, @Body() dto: CategoryDto) {
    return this.categoryService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(AtGuard)
  async delete(@Param('id') id: number) {
    return this.categoryService.delete(+id);
  }
}

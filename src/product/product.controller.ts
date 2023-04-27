import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AtGuard } from './../common/guards/at.guard';
import { getAllProductDto } from './dto/get-all-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AtGuard)
  async create() {
    return this.productService.create();
  }

  @Get()
  async findAll(@Query() queryDto: getAllProductDto) {
    return this.productService.findAll(queryDto);
  }

  @Get('similar/:id')
  async findSimilar(@Param('id') id: string) {
    return this.productService.findSimilar(+id);
  }

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get('by-category/:categorySlug')
  async findByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.findByCategory(categorySlug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AtGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}

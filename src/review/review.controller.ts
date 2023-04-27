import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUserId } from 'src/common/decorators';
import { AtGuard } from './../common/guards/at.guard';
import { ReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAll() {
    return this.reviewService.findAll();
  }

  @Post(':productId')
  @UseGuards(AtGuard)
  async create(
    @CurrentUserId() userId: string,
    @Param('productId') productId: string,
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.create(userId, +productId, dto);
  }
}

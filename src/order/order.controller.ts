import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUserId } from './../common/decorators/current-user-id.decorator';
import { AtGuard } from './../common/guards/at.guard';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @UseGuards(AtGuard)
  findAll(@CurrentUserId() userId: string) {
    return this.orderService.findAll(userId);
  }
}

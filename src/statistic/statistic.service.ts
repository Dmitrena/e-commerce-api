import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { UserService } from './../user/user.service';

@Injectable()
export class StatisticService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getMain(userId: string) {
    const user = await this.userService.findOne(userId, {
      orders: {
        select: {
          items: true,
        },
      },
      reviews: true,
    });
    // const result = await this.prisma
    //   .$queryRaw`SELECT email FROM "User" WHERE id = ${userId}`;
    const result = await this.prisma
      .$queryRaw`SELECT items FROM "Order" WHERE "user_id" = ${userId}`;

    return [
      {
        name: 'Test',
        value: result,
      },
      {
        name: 'Orders',
        value: user.orders.length,
      },
      {
        name: 'Reviews',
        value: user.reviews.length,
      },
      {
        name: 'Favorites',
        value: user.favorites.length,
      },
      {
        name: 'Total amount',
        value: 1000,
      },
    ];
  }
}

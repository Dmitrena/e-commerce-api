import { Module } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { UserService } from './../user/user.service';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService, PrismaService, UserService],
})
export class StatisticModule {}

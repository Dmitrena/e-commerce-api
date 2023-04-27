import { Controller, Get, Param } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('main/:userId')
  async getMainStatistic(@Param('userId') userId: string) {
    return this.statisticService.getMain(userId);
  }
}

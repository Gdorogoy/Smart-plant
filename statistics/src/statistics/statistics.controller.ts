import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}


  @Get('/:id')
  async getAllData(@Param('id') id :string){
    return await this.statisticsService.getAllData(id);
  }
}

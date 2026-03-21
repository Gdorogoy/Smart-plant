import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Session } from './entites/session.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}


  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getAllData(@Param('id') id :string){
    return await this.statisticsService.getAllData(id);
  }

}

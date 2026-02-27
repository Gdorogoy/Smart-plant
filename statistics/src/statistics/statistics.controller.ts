import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Session } from './entites/session.entity';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}


  @Get('/:id')
  async getAllData(@Param('id') id :string){
    return await this.statisticsService.getAllData(id);
  }

  @MessagePattern('new-session')
  async reciveSessionData(@Payload() data:Session){
      //TODO:Method to resovle the message

  }
}

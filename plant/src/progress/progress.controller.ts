import { Controller } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Session } from './entites/session';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @MessagePattern('new-session')
  async reciveMessage(@Payload() data:Session, ctx:RmqContext){
    return await this.progressService.addXpToPlant(data);
  }
}

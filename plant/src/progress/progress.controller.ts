import { Controller, InternalServerErrorException } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Session } from './entites/session';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}


  //TODO: add custom exception
  @MessagePattern('new-session')
  async reciveMessage(@Payload() data:Session,@Ctx() ctx:RmqContext){
    const channel=ctx.getChannelRef();
    const ogMessage=ctx.getMessage();
    try{
      const res=await this.progressService.addXpToPlant(data);
      channel.ack(ogMessage);
      return res;
    }catch(err){
      channel.nack(ogMessage);
      throw new InternalServerErrorException(err);
    }
  }
}

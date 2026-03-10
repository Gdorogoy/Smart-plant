import { Controller } from '@nestjs/common';
import { EmailNotifciationsService } from './email-notifciations.service';
import { MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller('email-notifciations')
export class EmailNotifciationsController {

  

  constructor(private readonly emailNotifciationsService: EmailNotifciationsService) {}


  @MessagePattern('missed-watering')
  async sendMissedWatering(@Payload() data:any,context:RmqContext){
    const channel=context.getChannelRef();
    channel.ack(context.getMessage());
    return await this.emailNotifciationsService.sendMissedWateringDay(data);
  }


  @MessagePattern('weekly-statistics')
  async sendWeeklyStatistics(@Payload() data:any,context:RmqContext){
    const channel=context.getChannelRef();
    channel.ack(context.getMessage());
    return await this.emailNotifciationsService.sendWeeklyStatistics(data);
  }
}

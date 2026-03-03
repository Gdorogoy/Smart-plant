import { Controller } from '@nestjs/common';
import { EmailNotifciationsService } from './email-notifciations.service';

@Controller('email-notifciations')
export class EmailNotifciationsController {

  

  constructor(private readonly emailNotifciationsService: EmailNotifciationsService) {}


}

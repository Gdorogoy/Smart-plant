import { Module } from '@nestjs/common';
import { EmailNotifciationsService } from './email-notifciations.service';
import { EmailNotifciationsController } from './email-notifciations.controller';
import { Resend } from 'resend';

@Module({
  controllers: [EmailNotifciationsController],
  providers: [EmailNotifciationsService,Resend],
})
export class EmailNotifciationsModule {}

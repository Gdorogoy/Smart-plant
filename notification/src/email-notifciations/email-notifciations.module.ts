import { Module } from '@nestjs/common';
import { EmailNotifciationsService } from './email-notifciations.service';
import { EmailNotifciationsController } from './email-notifciations.controller';
import { Resend } from 'resend';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  controllers: [EmailNotifciationsController],
  providers: [EmailNotifciationsService,Resend],
})
export class EmailNotifciationsModule {}

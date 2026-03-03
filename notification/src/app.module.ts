import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EmailNotifciationsModule } from './email-notifciations/email-notifciations.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    EmailNotifciationsModule,
    ScheduleModule.forRoot(),
    HttpModule,
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

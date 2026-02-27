import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { PrimsaModule } from './primsa/primsa.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [SessionModule,PrimsaModule,
    ConfigModule.forRoot({
      isGlobal:true
    }),
    RabbitmqModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

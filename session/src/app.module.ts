import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { PrimsaModule } from './primsa/primsa.module';

@Module({
  imports: [SessionModule,PrimsaModule,
    ConfigModule.forRoot({
      isGlobal:true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

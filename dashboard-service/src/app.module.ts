import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HttpModule,ConfigModule.forRoot({isGlobal:true}), AuthModule],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantModule } from './plant/plant.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ProgressModule } from './progress/progress.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PlantModule, PrismaModule, 
    ConfigModule.forRoot({isGlobal:true}), ProgressModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

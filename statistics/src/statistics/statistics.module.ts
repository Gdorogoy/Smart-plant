import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[HttpModule,PrismaModule,
    ClientsModule.register([{
    name:"STATISTICS-SERVICE",
    transport:Transport.RMQ,
    options:{
      queue:"notification_queue",
      urls:["amqp://localhost:5672"],
      queueOptions:{
        durable:false
      }
    }
  }])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}

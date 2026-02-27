import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionGateway } from './session.gateway';
import { SessionController } from './session.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [SessionGateway, SessionService],
  controllers:[SessionController],
  imports:[
    ClientsModule.register([{
      name:'SESSION-SERVICE',
      transport:Transport.RMQ,
      options:{
        urls:["amqp://localhost:5672"],
        queue:"sessions_queue",
        queueOptions:{
          durable:false
        }
      }
    }])
  ]
})
export class SessionModule {}

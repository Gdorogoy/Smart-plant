import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionGateway } from './session.gateway';
import { SessionController } from './session.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtGuard } from 'src/auth/jwt.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [SessionGateway, SessionService,JwtGuard],
  controllers:[SessionController],
  imports:[
    AuthModule,
    ClientsModule.register([{
      name:'SESSION-SERVICE',
      transport:Transport.RMQ,
      options:{
        urls:["amqp://localhost:5672"],
        queue:"sessions_queue",
        queueOptions:{
          durable:false
        },
        noAck:true,

      }
    },
    {
      name:'USER-SERVICE',
      transport:Transport.RMQ,
      options:{
        urls:["amqp://localhost:5672"],
        queue:"user_queue",
        queueOptions:{
          durable:false
        },
        noAck:true
      }
    }]),
    
  ]
})
export class SessionModule {}

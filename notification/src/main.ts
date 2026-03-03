import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport:Transport.RMQ,
    options:{
      urls:["amqp://localhost:5672"],
      queue:"notification_queue",
      queueOptions:{
        durable:false
      }
    }
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


//TODO: 
//  1.weekly report (at sunday)
//  2.streak breask or achives 10 30 60 90 + add streak feature
//  3.when registrating
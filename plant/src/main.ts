import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    transform:true
  }));


  app.connectMicroservice<MicroserviceOptions>({
    transport:Transport.RMQ,
    options:{
      urls:["amqp://localhost:5672"],
      queue:"sessions_queue",
      queueOptions:{
        durable:false
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

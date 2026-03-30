import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AllExceptionsFilter } from './filter/AllExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  
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

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

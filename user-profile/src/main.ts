import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    transform:true
  }));
  
  app.useGlobalGuards();
  app.use(cookieParser());

  const docsConfig=new DocumentBuilder()
  .setTitle('User service')
  .setDescription('Service for managing user info and operations')
  .build();

  const docs=SwaggerModule.createDocument(app,docsConfig);

  SwaggerModule.setup('docs',app,docs);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

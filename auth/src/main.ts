import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    transform: true
  }));
  app.useGlobalGuards()
  app.use(cookieParser());

  const docsConfig=new DocumentBuilder()
  .setTitle('Auth service')
  .setDescription('Service for authenticaion')
  .build();

  //.addBearerAuth() for later use

  const documentFactory=SwaggerModule.createDocument(app,docsConfig);
  
  SwaggerModule.setup('docs',app,documentFactory);

  app.enableCors({
    origin:true,
    credentials:true
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//TODO: 
// 2) Add guard to the needed endpoints 
// 3) Write custom exceptions
// 4) Rewrite so the guards would acctually matter
// 5) Start the fronts
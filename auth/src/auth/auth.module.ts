import { PassportModule } from '@nestjs/passport';
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './config/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Module({
  imports:[
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:getJwtConfig,
    }),
    
  ],
  controllers: [AuthController,],
  providers: [AuthService],
})
export class AuthModule {}

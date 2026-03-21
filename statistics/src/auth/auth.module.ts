import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [JwtStrategy],
  exports:[PassportModule],
  imports:[PassportModule,ConfigModule,JwtModule.registerAsync({
    inject:[ConfigService],
    useFactory:(config:ConfigService)=>({
      secret:config.getOrThrow("JWT_SECRET")
    })
  })]
})
export class AuthModule {}

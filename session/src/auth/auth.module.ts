import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module, Inject } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [JwtStrategy],
  exports:[PassportModule,JwtModule],
  imports:[PassportModule,ConfigModule,JwtModule.registerAsync({
    inject:[ConfigService],
    useFactory:(config:ConfigService)=>({
      secret:config.getOrThrow("JWT_SECRET")
    })
  })]
})
export class AuthModule {}

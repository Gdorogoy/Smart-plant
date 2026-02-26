import { JwtModule } from '@nestjs/jwt';
import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';


@Module({
    providers:[JwtStrategy,PassportModule],
    exports:[PassportModule],
    imports:[UserModule,PassportModule,ConfigModule,
        JwtModule.registerAsync({
            inject:[ConfigService],
            useFactory:(config:ConfigService)=>({
                secret:config.getOrThrow("JWT_SECRET")
            }),
        
    })]
})
export class AuthModule{}
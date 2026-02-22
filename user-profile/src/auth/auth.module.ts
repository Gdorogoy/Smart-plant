import { JwtModule } from '@nestjs/jwt';
import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { ConfigService } from '@nestjs/config';


@Module({
    providers:[],
    exports:[],
    imports:[UserModule,JwtModule.register({
        secret:(new ConfigService).getOrThrow("JWT_SECRET"),
    })]
})
export class AuthModule{}
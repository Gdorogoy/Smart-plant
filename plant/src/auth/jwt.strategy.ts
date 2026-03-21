import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'JWT'){

    constructor(
        configService:ConfigService
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:true,
            secretOrKey:configService.getOrThrow("JWT_SECRET")
        })
    }

    validate(payload:any) {
        return {id:payload.id}
    }
}
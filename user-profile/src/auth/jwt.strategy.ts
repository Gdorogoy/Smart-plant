import { ExtractJwt,Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:configService.getOrThrow("JWT_SECRET")
        });
    }

    async validate(payload:any) {
        return await this.userService.getUser(payload.sub);
    }
}
//Created strategy to use -> @UseGuard(AuthGurad('jwt'));


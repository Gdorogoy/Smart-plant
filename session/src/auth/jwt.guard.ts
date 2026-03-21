import { Socket } from 'socket.io';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class JwtGuard implements CanActivate{

    constructor(private readonly jwtService:JwtService){

    }

    canActivate(context: ExecutionContext): boolean{
        
        const client =context.switchToWs().getClient<Socket>();
        const token= client.handshake.query.token as string;
        try{
            const payload=this.jwtService.verify(token)
            client.data.user=payload;
            return true;
        }catch(err){
            return false;
        }
    }
}
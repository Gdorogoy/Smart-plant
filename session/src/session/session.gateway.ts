import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SessionService } from './session.service';
import {Server, Socket} from 'socket.io'
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { JwtService } from '@nestjs/jwt';
@WebSocketGateway()
export class SessionGateway implements OnGatewayConnection , OnGatewayDisconnect {
  @WebSocketServer() server:Server;


  constructor(
    private readonly sessionService: SessionService,
    private readonly jwtService : JwtService
  ) {}

  handleConnection(client:Socket) {
    const token=client.handshake.query.token as string;
    console.log(token);
    try{  
      const payload=this.jwtService.verify(token)
      client.data.user=payload;
    }catch(err){
      client.disconnect();
      throw err;
    }


  }
  handleDisconnect(client: Socket) {
    client.disconnect();
  }

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: any) {
    console.log('TEST RECEIVED:', data);
    return { success: true };
  }

  @SubscribeMessage('start')
  // @UseGuards(JwtGuard)
  async startSession(
    @MessageBody() data:any,
    @ConnectedSocket() client:Socket
  ){
    const session= await this.sessionService.startSession(data);
    // client.emit('sessionStarted',{
    //   id:session.id,
    //   startedAt:session.createdAt
    // });
    return {
      event: 'sessionStarted', 
      data: session 
    };
  }

  @SubscribeMessage('end')
  // @UseGuards(JwtGuard)
  async endSession(
    @MessageBody() data:any,
    @ConnectedSocket() client:Socket
  ){
    const session= await this.sessionService.endSession(data);

    // client.emit('sessionEnded',{session});
    return { event: 'sessionEnded', data: session };
  }



}

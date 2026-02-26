import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SessionService } from './session.service';
import {Server, Socket} from 'socket.io'
import { StartSessionRequest } from './entites/start.request';
@WebSocketGateway()
export class SessionGateway implements OnGatewayConnection , OnGatewayDisconnect {
  @WebSocketServer() server:Server;


  constructor(private readonly sessionService: SessionService) {}

  handleConnection(client:Socket) {}
  handleDisconnect(client: Socket) {
    client.disconnect();
  }

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: any) {
    console.log('TEST RECEIVED:', data);
    return { success: true };
  }

  @SubscribeMessage('start')
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
  async endSession(
    @MessageBody() data:any,
    @ConnectedSocket() client:Socket
  ){
    const session= await this.sessionService.endSession(data);
    // client.emit('sessionEnded',{session});
    this.handleDisconnect(client);
    return { event: 'sessionEnded', data: session };

  }



}

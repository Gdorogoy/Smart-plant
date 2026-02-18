import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SessionService } from './session.service';
import {Server, Socket} from 'socket.io'
import { StartSessionRequest } from './entites/start.request';
@WebSocketGateway()
export class SessionGateway implements OnGatewayConnection , OnGatewayDisconnect {
  @WebSocketServer() server:Server;


  constructor(private readonly sessionService: SessionService) {}

  handleConnection(client:Socket) {}
  handleDisconnect(client: Socket) {
    

  }

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: any) {
    console.log('TEST RECEIVED:', data);
    return { success: true };
  }

  @SubscribeMessage('start')
  async startSession(@MessageBody() data:any){
    const parsed = JSON.parse(data);
    
    const session= await this.sessionService.startSession(parsed);
    return { event: 'sessionStarted', data: session };
  }

  @SubscribeMessage('end')
  async endSession(@MessageBody() data:any){
    const parsed = JSON.parse(data);
    const session= await this.sessionService.startSession(parsed);
    return { event: 'sessionEnded', data: session };

  }



}

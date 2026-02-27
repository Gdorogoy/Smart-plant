import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/primsa/primsa.service';
import { StartSessionRequest } from './entites/start.request';
import { EndSessionRequest } from './entites/end.request';
import { Session } from './entites/session';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

@Injectable()
export class SessionService {

    constructor(
        private readonly prismaService:PrismaService,
        @Inject('SESSION-SERVCIE') private client:ClientProxy
    ){
    }


    //Method to connect to RabbitMQ
    async onModuleInit(){
        try{
            await this.client.connect();
        }catch(err){
            console.error(err);
            throw err;
        }
    }

    //Method to send statistics data as message payload via rabbtimq
    private async sendStatistics(routingKey:string,payload:Session){
        try{
            return this.client.send(routingKey,payload);
        }catch(err){
            console.error(err);
            throw err;
        }
        
    }

//   async emitMessage(pattern: string, data: any) {
//     // Fire-and-forget (doesn't wait for response)
//     this.client.emit(pattern, data);
//   }

    //Method to start using timer session , created--started via WebSockets
    async startSession(data :StartSessionRequest){
        try{
            const {plantId,userId}=data;
            const res= await this.prismaService.userSession.create({
                data:{
                    plantId,
                    userId,
                    duration:1
                }
            });
            return res;
        }catch(err){
            throw new InternalServerErrorException(err);
        }
    }

    //Method that ends session , updates the duration of it
    //TODO: When statistic service built: add auto send via message queue the data
    async endSession(data :EndSessionRequest){
        try{
            const {sessionId}=data;
            const session=await this.prismaService.userSession.findFirst({
                where:{
                    id:sessionId
                }
            });
            console.log(session);
            if(!session){
                throw new NotFoundException('Session not found');
                return;
            }

            const updated= await this.prismaService.userSession.update({
                where:{
                    id:sessionId
                },
                data:{
                    duration:(Date.now()-session.createdAt.getTime())
                }
            });

            await this.sendStatistics('new-session',updated);
            
            return updated;

        }catch(err){
            throw new InternalServerErrorException(err);
        }
    }

    async getAllSessions(id:string){
        try{
            const sessions=await this.prismaService.userSession.findMany({
                where:{
                    userId:id
                }
            });
            return sessions;
        }catch(err){
            throw new InternalServerErrorException(err);
        }
    }
}

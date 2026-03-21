import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/primsa/primsa.service';
import { StartSessionRequest } from './entites/start.request';
import { EndSessionRequest } from './entites/end.request';
import { Session } from './entites/session';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';
import { lastValueFrom} from 'rxjs'

@Injectable()
export class SessionService {

    constructor(
        private readonly prismaService:PrismaService,
        @Inject('SESSION-SERVICE') private statisticsClient:ClientProxy,
        @Inject('USER-SERVICE') private userClient :ClientProxy
    ){
    }


    //Method to connect to RabbitMQ
    async onModuleInit(){
        try{
            await this.statisticsClient.connect();
            await this.userClient.connect()
        }catch(err){
            console.error(err);
            throw err;
        }
    }

    //Method to send statistics data as message payload via rabbtimq
    private async sendStatistics(routingKey:string,payload:Session){
        try{
            return lastValueFrom(this.statisticsClient.send(routingKey,payload));
        }catch(err){
            console.error(err);
            throw err;
        }
    }

    private async sendToUser(routingKey:string,payload:any){
        try{
            return lastValueFrom(this.userClient.send(routingKey,payload));
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
    // If session has split into new day it will be splited into 2
    async endSession(data :EndSessionRequest){
        try{
            const {sessionId}=data;

            const session=await this.prismaService.userSession.findFirst({
                where:{
                    id:sessionId
                }
            });
            if(!session){
                throw new NotFoundException('Session not found');
            }
            const today=new Date();
            if(session.createdAt.getDate() !== today.getDate()){

                const midNight=new Date()
                midNight.setHours(0, 0, 0, 0);
                const firstPart= await this.prismaService.userSession.update({
                    where:{
                        id:sessionId
                    },
                    data:{
                        duration:(midNight.getTime()-session.createdAt.getTime())
                    }
                });

                const {plantId,userId}=firstPart;

                const timeNow=new Date();
                const secondPart= await this.prismaService.userSession.create({
                    data:{
                        plantId,
                        userId,
                        duration:(timeNow.getTime()-midNight.getTime())
                    }
                });

                await this.sendStatistics('new-session',firstPart);
                await this.sendStatistics('new-session',secondPart);
                await this.sendToUser('update-plant',{
                    userId:userId,
                    lastActivePlantId:plantId})
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
            const {plantId,userId}=updated;

            await this.sendStatistics('new-session',updated);
            await this.sendToUser('update-plant',{
                userId:userId,
                lastActivePlantId:plantId})

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

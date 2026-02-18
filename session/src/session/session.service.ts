import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/primsa/primsa.service';
import { StartSessionRequest } from './entites/start.request';
import { EndSessionRequest } from './entites/end.request';

@Injectable()
export class SessionService {
    constructor(private readonly prismaService:PrismaService){
    }


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
            const {time,sessionId}=data;
            const session=await this.prismaService.userSession.findFirst({
                where:{
                    id:sessionId
                }
            });
            if(!session){
                throw new NotFoundException('Session not found');
            }

            return await this.prismaService.userSession.update({
                where:{
                    id:sessionId
                },
                data:{
                    duration:(time.getTime()-session.createdAt.getTime())
                }
            });
            
            return {message:'ended'};

        }catch(err){
            throw new InternalServerErrorException(err);
        }
    }

}

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Session } from './entites/session';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProgressService {

    constructor(private readonly prismaService:PrismaService){}

    private calcNextLevelXp(level:number){
        return 1000*(Math.pow(1.5,level-1));
    }
    private calcDailyBonusXp(userId:string){
        //TODO: find a way that will be the most optimal to fetch the user avarage level
    }
    private calcCurrentRecivedXp(duration:number){
        return Math.floor(duration/60000);
    }

    async addXpToPlant(data:Session){
        try{
            const{plantId,duration,userId}=data;
            let plant=await this.prismaService.plant.findUnique({
                where:{id:plantId}
            });
            if(!plant){
                throw new NotFoundException('Plnat not found');
            }

            if(plant.currentXp+this.calcCurrentRecivedXp(duration)>=this.calcNextLevelXp(plant.currentLevel)){
                plant=await this.prismaService.plant.update({
                    where:{
                        id:plantId
                    },
                    data:{
                        currentLevel:plant.currentLevel+1,
                        currentXp:(plant.currentXp+this.calcCurrentRecivedXp(duration))-this.calcNextLevelXp(plant.currentLevel),
                        totalXp:plant.currentXp+this.calcCurrentRecivedXp(duration)
                    }
                });
            }else{
                plant=await this.prismaService.plant.update({
                    where:{
                        id:plantId
                    },
                    data:{
                        currentXp:plant.currentXp+this.calcCurrentRecivedXp(duration),
                        totalXp:plant.totalXp+this.calcCurrentRecivedXp(duration)
                    }
                });
            }
            return plant;
        }catch(err){
            console.error(err);
            throw new InternalServerErrorException(err);
        }
    }
}

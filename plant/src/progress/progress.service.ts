import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Session } from './entites/session';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProgressService {

    constructor(private readonly prismaService:PrismaService){}

    //Calculates the next plant level by doing 1000*(1.5)^(current level-1)
    private calcNextLevelXp(level:number){
        return 1000*(Math.pow(1.5,level-1));
    }

    //Calculates the daily bonus for each plant if user completed his daily goal by doing 100*(1.2)^(plant level-1)
    private calcDailyBonusXp(userId:string){
        //TODO: find a way that will be the most optimal to fetch the user avarage level
    }

    // Calculates the earned xp by doing duration/60000 * 5 (each minute is 5 xp)
    private calcCurrentReceivedXp(duration:number){
        console.log('duration ms:', duration);
        console.log('duration mins:',duration / 60000);
        return Math.floor(duration/60000)*5;
    }


    //Adds the xp to the plant
    //TODO:add checking if daily goal met
    async addXpToPlant(data:Session){
        try{
            const{plantId,duration,userId}=data;
            let plant=await this.prismaService.plant.findUnique({
                where:{id:plantId}
            });
            if(!plant){
                throw new NotFoundException('Plnat not found');
            }

            const gainedXp = this.calcCurrentReceivedXp(duration);
            const newXp = plant.currentXp + gainedXp;
            const xpNeeded = this.calcNextLevelXp(plant.currentLevel);


            if(newXp>=xpNeeded){
                plant=await this.prismaService.plant.update({
                    where:{
                        id:plantId
                    },
                    data:{
                        currentLevel:plant.currentLevel+1,
                        currentXp:newXp-xpNeeded,
                        totalXp:plant.totalXp+newXp
                    }
                });
            }else{
                plant=await this.prismaService.plant.update({
                    where:{
                        id:plantId
                    },
                    data:{
                        currentXp:newXp,
                        totalXp:plant.totalXp+newXp
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

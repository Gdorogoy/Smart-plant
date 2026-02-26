import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlant } from './dto/create.request';
import { stringify } from 'querystring';

@Injectable()
export class PlantService {

    constructor(
        private readonly prismaService:PrismaService, 
        private readonly configService:ConfigService){
    }

    async createPlant(req:CreatePlant){
        try{
            const {userId,image,title}=req;
            const plant=await this.prismaService.plant.create({
                data:{
                    userId,
                    image,
                    title
                }
            });

            return plant;

            
        }catch(err){
            console.error(`error in creating plant:${err}`);
            throw new InternalServerErrorException("error in creating plant");
        }
    }

    async getUserPlants(id:string){
        try{
            const plants=await this.prismaService.plant.findMany({
                where:{
                    userId:id
                }
            });
            return plants;


        }catch(err){
            console.error(`error in getting user plants:${err}`);
            throw new InternalServerErrorException("error in getting user plants");
        }
    }
}

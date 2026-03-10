import { firstValueFrom, reduce } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { AnyARecord } from 'dns';

@Injectable()
export class EmailNotifciationsService {

    private readonly resend:Resend;

    constructor(
        private readonly configService:ConfigService,
        private readonly httpSerivce:HttpService
    ){
        this.resend=new Resend(configService.getOrThrow("RESEND_API_KEY"));
    }

    //Method for sending email to user 
    //TODO: add diffrent templates like template for :streak , statistics, etc..
    private async sendEmail(reciver:string,subject:string,data:string){
        try{
            this.resend.emails.send({
                from:'onboarding@resend.dev',
                to:reciver,
                subject:subject,
                html:data
            });
        }catch(err){
            throw new InternalServerErrorException(err);
        }
    }



    //Method for sending weekly statistics for the previous week
    async sendWeeklyStatistics(data:any){
        try{
            
            const users=data;
            users.forEach((user:any) => {
                try{
                    this.sendEmail(user.email,'weekly statistics',`${user.username},${user.stats}`);
                }catch(err){
                    throw new InternalServerErrorException(`Issues at sending email to 
                        ${user}`);
                }
            });    

        
            return {content:'All sent'};
        }catch(err){
            throw new InternalServerErrorException(`
                Error in sending weekly statistics
                ${err}`
            );
        }
    }

    //TODO:add custom exeptions for errors in sending emails 

    //Method for sending remaider if no session was recoreded
    async sendMissedWateringDay(data:any){
        try{
            const users=data;
            users.forEach((user:any) => {
                try{
                    this.sendEmail(user.email,'weekly statistics',`${user.username},${user.stats}`);
                }catch(err){
                    throw new InternalServerErrorException(`Issues at sending email to 
                        ${user}`);
                }
            })
        }catch(err){
            throw new InternalServerErrorException(`
                Error in sending daily remainder
                ${err}`
            );
        }
    }

    //Method for sending achivments to user if he unlocked new streak/Achivment
    async sendAchivedAchivment(user:any,subject:string,body:string){
        try{
            await this.sendEmail(user.email,subject,body);
            return {content:'email sent'}
        }catch(err){
            throw new InternalServerErrorException(`
                Error in sending streak achived
                ${err}`
            );
        }
    }
}

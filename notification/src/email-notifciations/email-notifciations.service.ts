import { firstValueFrom, reduce } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
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



    //Method for sending weekly statistics for the previous week (each sunday at 11:15)
    @Cron("15 11 * * 0")
    async sendWeeklyStatistics(){
        try{
            const res=await firstValueFrom(this.httpSerivce.post(""));
            if(res.data.content!=="sent all") {
                throw new InternalServerErrorException(`
                    Not all emails were sent. list of those who havent recived:
                    ${res.data.missed}
                    `
                );
            }
            return {content:'All sent'};
        }catch(err){
            throw new InternalServerErrorException(`
                Error in sending weekly statistics
                ${err}`
            );
        }
    }


    //Method for sending remaider if no session was recoreded until now each day at 15:30
    @Cron("30 15 * * *")
    async sendMissedWateringDay(){
        try{
            const res=await firstValueFrom(this.httpSerivce.get(""));
            if(res.data.content!=="empty"){
                const users=res.data.content;
                users.forEach(async (user:any) => {
                    await this.sendEmail(user.email,"MISSED WATERING DAY","dont miss the watering");
                });
                return {content:'Sent mail'};
            }
            return {content:'No mail sent'};
        }catch(err){
            throw new InternalServerErrorException(`
                Error in sending daily remainder
                ${err}`
            );
        }
    }

    //Method for sending achivments to user if he unlocked new streak/Achivmedn
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

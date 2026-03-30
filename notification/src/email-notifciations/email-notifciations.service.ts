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
        return await this.resend.emails.send({
            from:'onboarding@resend.dev',
            to:reciver,
            subject:subject,
            html:data
        });
    }



    //Method for sending weekly statistics for the previous week
    async sendWeeklyStatistics(users: any[]) {
        await Promise.all(users.map(user => 
            this.sendEmail(user.email, 'Weekly Statistics', `${user.username}, ${user.stats}`)
        ));    
        return { content: 'All sent' };
    }

    //Method for sending remaider if no session was recoreded
    async sendMissedWateringDay(users:any){

        await Promise.all(users.map((user:any) => {
            this.sendEmail(user.email,'weekly statistics',`${user.username},${user.stats}`);
        }));
    }

    //Method for sending achivments to user if he unlocked new streak/Achivment
    async sendAchivedAchivment(user:any,subject:string,body:string){
        await this.sendEmail(user.email,subject,body);
        return {content:'email sent'}
    }
}

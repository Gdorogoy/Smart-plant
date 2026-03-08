import { Cron } from '@nestjs/schedule';
import { userSession } from './../../node_modules/.pnpm/@prisma+client@7.4.2_prisma@7.4.2_@types+react@19.2.14_react-dom@19.2.4_react@19.2.4__r_49b4b128965f74ea9bbd7586bc0c7d7a/node_modules/.prisma/client/index.d';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Session } from './entites/session.entity';
import { MonthlyActivityItem } from './entites/monthly.activity';
import { ClientProxy, RmqContext } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatisticsService {

    private readonly SESSION_SERVICE_URL:string;
    private sessions:string[];


    constructor(
        private readonly httpService:HttpService,
        private readonly configService:ConfigService,
        @Inject("STATISTICS-SERVICE") private client:ClientProxy,
        private readonly prismaService:PrismaService
    ){
        this.SESSION_SERVICE_URL=configService.getOrThrow("SESSION_URL");
    }


    //TODO:
    // 2. Impelemnt method inactive users (session wernet recordeed until 15:30)


    //Fetches all of the userSessions
    private async getUserSession(id:string){
        try{
            const userSessions=await this.prismaService.userSession.findMany({
                where:{
                    userId:id
                },
            });
            return userSessions;
        }catch(err){
            console.log(err);
            throw new Error(err);
        }
    }

    //Method to normolize the date from DD/MM/YY:MM.. to DD-MM-YY
    private normalize(d: Date): string {
        return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
    }

    //Checks wheter the passed dates are the same
    private isSameDate(a: Date, b:Date){
        return (a.getFullYear() === b.getFullYear()) &&
                (a.getMonth() === b.getMonth()) &&
                (a.getDate() === b.getDate())
    }

    private isInWeeksRange(a: string){
        const d=new Date(a);
        const today=new Date();

        const lastWeekMax=new Date();
        lastWeekMax.setDate(today.getDate()-7);
        return  d>=lastWeekMax && d<=today;
    }

    async getAllData(userId:string){
        const mothlyActivity=await this.getMonthlyActivity(userId);
        const todayActivity=await this.getTodayActivity(userId);
        const weeklyActivityByPlant=await this.getWeeklyActivityByPlant(userId);
        const dailyWeeklyActivity=await this.getDailyWeeklyActivity(userId);

        return{
            mothlyActivity:mothlyActivity,
            todayActivity:todayActivity,
            weeklyActivityByPlant:weeklyActivityByPlant,
            dailyWeeklyActivity:dailyWeeklyActivity
        }
    }

    //Calculates and returns where in the last 31 days logged a session
    async getMonthlyActivity(userId: string) {
        try {
            const today = new Date();
            
            //Fetch sessions for this request
            const userSessionsDB = await this.getUserSession(userId);
            const userSessions=userSessionsDB.map((session:Session) => this.normalize(new Date(session.createdAt)));
            const sessionSet = new Set(userSessions);

            //Generate the last 31 days and check if user had any sessions
            const result:MonthlyActivityItem[] = [];
            for (let i = 31; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const dateStr = this.normalize(d);

                result.push({
                    date: dateStr,
                    active: sessionSet.has(dateStr),
                });
            }

            return result;
        } catch (err) {
            throw new Error(err);
        }
    }

    //Calculates how much stuided overall across all of the plants today
    async getTodayActivity(userId:string){
        try{
            const userSession=await this.getUserSession(userId);
            const todaySessions=userSession.filter((session:Session)=>{
                return this.normalize(new Date(session.createdAt))===this.normalize(new Date(Date.now()))
            });
            let sum=0;
            todaySessions.forEach((session:Session)=> {
                sum+=session.duration
            });
            return sum;


        }catch(err){
            throw new Error(err);
        }
    }
    

    //Calculates how much stuided overall across all of the plants in the past week
    async getWeeklyActivityByPlant(userId: string){
        try{
            const userSession=await this.getUserSession(userId);
            const thisWeeksSessions=userSession.filter((session:Session)=>{
                return this.isInWeeksRange(this.normalize(new Date(session.createdAt)))
            });
            const map=new Map<string,number>();
            thisWeeksSessions.forEach((session:Session)=>{
                map.set(session.plantId,(map.get(session.plantId) ?? 0) + session.duration)
            });

            return Object.fromEntries(map);
        }catch(err){
            throw new Error(err);
        }
    }

    //Calculates how much stuided overall across all of the days in the past week
    async getDailyWeeklyActivity(userId:string){
        try{
            const userSession=await this.getUserSession(userId);
            const thisWeeksSessions=userSession.filter((session:Session)=>{
                return this.isInWeeksRange(this.normalize(new Date(session.createdAt)))
            });
            let sum=0;
            thisWeeksSessions.forEach((session:Session)=> {
                sum+=session.duration
            });
            return sum;

        }catch(err){
            throw new Error(err);
        }
    }


    //Method for sending out weekly statistics (sending message to the queue)
    @Cron('0 9 * * 0')
    private async getAllUsersWeeklyStatistics(){
        try{
            const users=(await firstValueFrom( this.httpService.get(''))).data;
            const oneWeekAgo=new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate()-7);
            const map=new Map<string,any>();
            // sessions.forEach((session:Session)=>{
            //     map.set(session.plantId,(map.get(session.plantId) ?? 0) + session.duration)
            // });


            for(const user of users){
                const plantStats=await this.getWeeklyActivityByPlant(user.id);
                map.set(
                    user.id,
                    {
                        email:user.email,
                        username:user.username,
                        stats:plantStats
                    }
                );
            }
            let payload;
            for(const [userId,data] of map){
                payload.push({
                    userId,
                    email:data.email,
                    username:data.username,
                    stats:data.stats});
            }
            this.client.emit('weekly-statistics',payload);

            return 'all-sent-weekly';

        }catch(err){
            throw new Error(err);
        }
    }

    //Method for sending reminders to those whose havent recorded session before 15:30
    @Cron(' 30 15 * * *')
    private async getAllMissedSessions(){
        try{
            const today=new Date();
            const users=(await firstValueFrom( this.httpService.get(''))).data;
            const sessions=await this.prismaService.userSession.findMany({
                where:{
                    createdAt:{gte:today}
                }
            });

            const set=new Set<string>();
            sessions.forEach((session:Session)=>{
                if(!set.has(session.userId)) set.add(session.userId);
            });
            //TODO:fix any type
            const missedUsers=users.filter((user:any)=>{
                return !set.has(user.id);
            })


            this.client.emit('missed-watering',missedUsers);
            return 'all-sent-missed'


        }catch(err){
            throw new Error(err);
        }
    }


}

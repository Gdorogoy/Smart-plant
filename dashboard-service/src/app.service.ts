import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  
  constructor(private readonly httpService:HttpService){

  }

  async getUserData(userId:string){
    const statisticService= (await firstValueFrom(this.httpService.get(`http://localhost:3003/statistics/${userId}`))).data;
    const plantService= (await firstValueFrom(this.httpService.get(`http://localhost:3005/plant/get/${userId}`))).data;

    const res={
      plants:plantService,
      statistic:statisticService
    }

    return res;
  }

}

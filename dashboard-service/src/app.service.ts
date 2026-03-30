import { firstValueFrom } from 'rxjs';
import { ConflictException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  
  constructor(private readonly httpService:HttpService){

  }

  async getUserData(userId:string,jwt:string){
    let statisticService;
    let plantService
    try{
      statisticService= (await firstValueFrom(this.httpService.get(`http://localhost:3003/statistics/${userId}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      }))).data;
    }catch(err){
      throw new ConflictException('statistics servie is down');
    }
    try{
      plantService= (await firstValueFrom(this.httpService.get(`http://localhost:3005/plant/get/${userId}`,{
        headers:{
          Authorization:`Bearer ${jwt}`
        }
      }))).data;
    }catch(err){
      throw new ConflictException('plant servie is down');
    }

    const res={
      plants:plantService,
      statistic:statisticService
    }

    return res;
  }

}

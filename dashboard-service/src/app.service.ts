import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  
  constructor(private readonly httpService:HttpService){

  }


  //TODO: fetch the data.
  async getUserData(){
    const statisticService= firstValueFrom(this.httpService.get('',{}));
    const plantService= firstValueFrom(this.httpService.get('',{}));
  }

}

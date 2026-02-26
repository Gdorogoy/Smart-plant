import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlantService } from './plant.service';
import { CreatePlant } from './dto/create.request';

@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}


  @Post('/create')
  async create(@Body() req:CreatePlant){
    return await this.plantService.createPlant(req);
  }

  @Get('/get/:id')
  async getAll(@Param('id') id:string){
    return await this.plantService.getUserPlants(id);
  }
}

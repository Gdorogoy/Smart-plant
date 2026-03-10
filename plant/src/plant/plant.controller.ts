import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlantService } from './plant.service';
import { CreatePlant } from './dto/create.request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('plant')
@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @ApiOperation({
    summary:'Creates the plant'
  })
  @Post('/create')
  async create(@Body() req:CreatePlant){
    return await this.plantService.createPlant(req);
  }


  @ApiOperation({
    summary:'Finds and returns the plant'
  })
  @Get('/get/:id')
  async getAll(@Param('id') id:string){
    return await this.plantService.getUserPlants(id);
  }
}

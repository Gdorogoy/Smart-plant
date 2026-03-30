import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create.user.request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @ApiOperation({
    summary:'Internal method used--called by auth serivce for creating(registerating user)'
  })
  @Post('create')
  create(@Body() req:CreateUserRequest) {
    console.log('im here')
    return this.userService.createUser(req);
  }

  @ApiOperation({
    summary:'Method for returning user info(non auth)'
  })
  @Get('get/:id')
  findUser(@Param('id') id: string) {
        console.log('im here by id')

    return this.userService.getUser(id);
  }

  @Patch('/:id/:plant')
  @UseGuards(AuthGuard('jwt'))
  updateLastPlant(@Param('id') id:string , @Param('plant') plantId:string){
    return this.userService.updateLastActivePlant(id,plantId);
  }





}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create.user.request';
import { GetUserRequest } from './dto/get.user.request';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @ApiOperation({
    summary:'Internal method used--called by auth serivce for creating(registerating user)'
  })
  @Post('create')
  create(@Body() req:CreateUserRequest) {
    return this.userService.createUser(req);
  }

  @ApiOperation({
    summary:'Method for returning user info(non auth)'
  })
  @Get('get/:id')
  findUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Patch('/:id/:plant')
  updateLastPlant(@Param('id') id:string , @Param() plantId:string){
    return this.userService.updateLastActivePlant(id,plantId);
  }





}

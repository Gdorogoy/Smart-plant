import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create.user.request';
import { GetUserRequest } from './dto/get.user.request';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post()
  findAll(@Body() req:CreateUserRequest) {
    return this.userService.createUser(req);
  }

  @Get()
  findOne(@Param('id') req: string) {
    return this.userService.getUser(req);
  }



}

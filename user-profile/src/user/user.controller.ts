import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create.user.request';
import { GetUserRequest } from './dto/get.user.request';
import { JwtGuard } from 'src/auth/jwt.guard';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post('create')
  create(@Body() req:CreateUserRequest) {
    return this.userService.createUser(req);
  }

  @Get('get/:id')
  findUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }



}

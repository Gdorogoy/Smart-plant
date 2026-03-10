import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterRequest } from './dto/register.req';
import { LoginRequest } from './dto/login.req';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @ApiOperation({
    summary:'Logs in the users'
  })
  @Post('login')
  login(@Body() req : LoginRequest , @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req,res);
  }


  @ApiOperation({
    summary:'Registrets the users'
  })
  @Post('register')
  register(@Body() req : RegisterRequest , @Res({ passthrough: true }) res: Response) {
    return this.authService.register(req,res);
  }


  @ApiOperation({
    summary:'Refreshes the access token',
  })
  @Post('refresh')
  refresh(@Req() req : Request , @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req,res);
  }


  @ApiOperation({
    summary:'Logs out the users'
  })
  @Post('logout')
  logout(@Body() req : LoginRequest , @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req,res);
  }

}

// class customPipeImplements pipeTransform
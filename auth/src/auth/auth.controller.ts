import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterRequest } from './dto/register.req';
import { LoginRequest } from './dto/login.req';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() req : LoginRequest , @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req,res);
  }

  @Post('register')
  register(@Body() req : RegisterRequest , @Res({ passthrough: true }) res: Response) {
    return this.authService.register(req,res);
  }

  @Post('refresh')
  refresh(@Req() req : Request , @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req,res);
  }

  @Post('logout')
  logout(@Body() req : LoginRequest , @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req,res);
  }

}

// class customPipeImplements pipeTransform
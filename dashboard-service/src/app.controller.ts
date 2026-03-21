import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('dashboard')
export class AppController {
  constructor(private readonly appService: AppService) {}



  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getUserData(@Param('id') userId :string) {
    return await this.appService.getUserData(userId);
  }
}

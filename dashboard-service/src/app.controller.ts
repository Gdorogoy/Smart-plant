import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('dashboard')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:id')
  async getUserData(@Param('id') userId :string) {
    return await this.appService.getUserData(userId);
  }
}

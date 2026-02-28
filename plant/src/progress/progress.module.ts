import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports:[],
  controllers: [ProgressController],
  providers: [ProgressService,PrismaService],
})
export class ProgressModule {}

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './primsa.service';

@Global()
@Module({
  controllers: [],
  providers: [PrismaService],
  exports:[PrismaService]
})
export class PrimsaModule {}

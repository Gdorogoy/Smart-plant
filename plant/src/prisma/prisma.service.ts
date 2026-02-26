import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(configService:ConfigService){
        const adapter=new PrismaPg({
            connectionString:configService.getOrThrow("DATABASE_URL")
        });
        super({adapter});
    }
}

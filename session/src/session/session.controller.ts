import { Controller, Get, Param } from "@nestjs/common";
import { SessionService } from "./session.service";


@Controller('sessions')
export class SessionController{


    constructor(private readonly sessionService:SessionService){

    }

    @Get('/:id')
    async getAll(@Param('id') id:string){
        return await this.sessionService.getAllSessions(id);
    }
}
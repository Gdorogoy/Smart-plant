import { Controller, Get, Param } from "@nestjs/common";
import { SessionService } from "./session.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";


@ApiTags('sessions')
@Controller('sessions')
export class SessionController{


    constructor(private readonly sessionService:SessionService){

    }

    @ApiOperation({
        summary:"Returns the all of the user sessions"
    })
    @Get('/:id')
    async getAll(@Param('id') id:string){
        return await this.sessionService.getAllSessions(id);
    }
}
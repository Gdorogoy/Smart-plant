import { IsDate, IsString } from "class-validator";

export class EndSessionRequest{

    @IsString()
    sessionId:string;
    
    @IsDate()
    time:Date;
}
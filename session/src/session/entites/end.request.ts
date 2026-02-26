import {IsDateString, IsString } from "class-validator";

export class EndSessionRequest{

    @IsString()
    sessionId:string;

}
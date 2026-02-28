import { IsNumber, IsString } from "class-validator";

export class Session{


    @IsString()
    sessionId:string;
    
    @IsString()
    userId :string;

    @IsString()
    plantId : string;
    
    @IsNumber()
    duration: number;


}
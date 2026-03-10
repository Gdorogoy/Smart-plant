import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class Session{

    @ApiProperty({
        type:String,
        description:'Session id on which the proggress begin recorded'
    })
    @IsString()
    sessionId:string;
    
    @ApiProperty({
        type:String,
        description:'User id whose proggress begin recorded'
    })
    @IsString()
    userId :string;


    @ApiProperty({
        type:String,
        description:'Plant id on which the proggress begin recorded'
    })    
    @IsString()
    plantId : string;
    

    @ApiProperty({
        type:Number,
        description:'The duration of the session'
    })
    @IsNumber()
    duration: number;


}
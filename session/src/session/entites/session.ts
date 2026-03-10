import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class Session{

    @ApiProperty({
        type:String,
        description:'The user who does the session'
    })
    @IsString()
    userId :string;

    @ApiProperty({
        type:String,
        description:'The plant who will recive the session'

    })
    @IsString()
    plantId : string;

    @ApiProperty({
        type:Number,
        description:'The duration of the session'
    })
    @IsNumber()
    duration: number;


    @ApiProperty({
        type:Date,
        description:'Date when created'
    })
    createdAt: Date
}
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreatePlant{


    @ApiProperty({
        type:String,
        description:'User id to whom the plant belongs'
    })
    @IsString()
    @IsNotEmpty()
    userId:string;

    @ApiProperty({
        type:String,
        description:'The image which will represent the plant'
    })
    @IsString()
    image:string;


    @ApiProperty({
        type:String,
        description:'The name/title of the plant'
    })
    @IsString() 
    @IsNotEmpty()
    title:string;


}
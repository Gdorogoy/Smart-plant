import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { IsString } from 'class-validator';

export class RegisterRequest{



    @ApiProperty(
        {
            type:String,
            description:'Users password',
        }
    )
    @IsString()
    @IsNotEmpty()
    password:string;


    @ApiProperty(
        {
            type:String,
            description:'Users email',
        }
    )    
    @IsString()
    @IsNotEmpty()
    email:string;


    @ApiProperty(
        {
            type:String,
            description:'Users username',
            

        }
    )    
    @IsString()
    @IsNotEmpty()
    username:string;


    @ApiProperty(
        {
            type:Number,
            description:'Users daily goal for session duration',
            
        }
    )    
    @IsNumber()
    @Max(86400000)
    @Min(1)
    goal:number;
}
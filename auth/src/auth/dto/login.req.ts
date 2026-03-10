import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';

export class LoginRequest{


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
}
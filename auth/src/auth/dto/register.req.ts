import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { IsString } from 'class-validator';

export class RegisterRequest{

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    username:string;

    @IsNumber()
    @Max(86400000)
    @Min(1)
    goal:number;
}
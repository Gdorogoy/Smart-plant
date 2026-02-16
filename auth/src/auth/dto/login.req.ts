import { IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';

export class LoginRequest{

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsString()
    @IsNotEmpty()
    email:string;
}
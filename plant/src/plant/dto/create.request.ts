import { IsNotEmpty, IsString } from 'class-validator';
export class CreatePlant{

    @IsString()
    @IsNotEmpty()
    userId:string;
    @IsString()
    image:string;
    @IsString() 
    @IsNotEmpty()
    title:string;


}
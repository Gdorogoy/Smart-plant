import { IsNumber, IsString } from "class-validator";

export class Session{
    @IsString()
    userId :string;
    
    @IsString()
    plantId : string;

    @IsNumber()
    duration: number;

    createdAt: Date
}
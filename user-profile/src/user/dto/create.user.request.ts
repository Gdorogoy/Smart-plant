import { IsNumber, IsString, Max, Min } from "class-validator";

export class CreateUserRequest {

    @IsString()
    authId:string;

    @IsString()
    username:string;

    @IsNumber()
    @Max(86400000)
    @Min(1)
    goal:number;

}

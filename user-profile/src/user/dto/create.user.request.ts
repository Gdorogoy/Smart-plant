import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min } from "class-validator";

export class CreateUserRequest {

    @ApiProperty({
        type:String,
        description:'Id of the user in the Auth service'
    })
    @IsString()
    authId:string;

    @ApiProperty({
        type:String,
        description:'Users username'
    })
    @IsString()
    username:string;

    @ApiProperty({
        type:Number,
        description:'User goal session time per day'
    })
    @IsNumber()
    @Max(86400000)
    @Min(1)
    goal:number;

}

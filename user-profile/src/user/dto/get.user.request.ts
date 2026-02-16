import { IsString } from "class-validator";

export class GetUserRequest {
    @IsString()
    authId:string;
}


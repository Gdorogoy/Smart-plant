import { IsString } from "class-validator";

export class StartSessionRequest{

    @IsString()
    userId :string;

    @IsString()
    plantId : string;

}
import { IsNumber, IsNotEmpty } from "class-validator";

export class AddParticipantDto {
    @IsNumber()
    @IsNotEmpty()
    routeId: number;
    
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}

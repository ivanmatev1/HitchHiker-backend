import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class createMessageDto {
    @IsNumber()
    @IsNotEmpty()
    chatId: number;

    @IsString()
    text: string;

    timestamp: Date;
}

import { IsNumber, IsNotEmpty } from "class-validator";

export class UpdateChatDto {
    @IsNumber()
    @IsNotEmpty()
    chatId: number;
    
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}

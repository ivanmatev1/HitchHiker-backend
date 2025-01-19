import { IsEmail, IsEnum } from "class-validator";
import { providerType } from "src/user/provider.enum";

export class AuthPayloadDto {
    @IsEmail()
    email: string;

    @IsEnum(providerType)
    provider: providerType;

    password: string;
}
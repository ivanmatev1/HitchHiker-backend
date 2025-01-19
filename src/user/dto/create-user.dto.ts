import { IsEmail, IsPhoneNumber, IsStrongPassword, IsOptional, IsEnum } from 'class-validator';
import { providerType } from '../provider.enum';

export class CreateUserDto {
    first_name: string;

    last_name: string;

    birthday: Date;

    @IsEmail()
    email: string;

    @IsEnum(providerType)
    provider: providerType;

    @IsOptional()
    @IsPhoneNumber()
    phone_number?: string;

    @IsOptional()
    verified_phone_number?: boolean;

    @IsOptional()
    verified_email?: boolean;

    @IsStrongPassword() // min 8 char, 1 lower, 1 upper, 1 number, 1 symbol
    password: string;

    @IsOptional()
    photo?: string;
}

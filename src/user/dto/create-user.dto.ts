export class CreateUserDto {
    first_name: string;
    last_name: string;
    birthday: Date;
    email: string;
    phone_number: string;
    verified_phone_number: boolean;
    verified_email: boolean;
    password: string;
    photo: string;
}

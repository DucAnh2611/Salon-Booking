import { IsEmail, IsNotEmpty, IsPhoneNumber, IsUUID } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class RegisterClientDto extends CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class CreateClientDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber('VI')
    phone: string;

    @IsNotEmpty()
    @IsUUID('all')
    userId: string;
}

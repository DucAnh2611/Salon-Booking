import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
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
    @IsUUID('all')
    userId: string;
}

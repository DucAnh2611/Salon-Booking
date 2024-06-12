import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export abstract class BaseAuthDto {
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class LoginEmpDto extends BaseAuthDto {
    @IsNotEmpty()
    @IsString()
    username: string;
}

export class LoginClientDto extends BaseAuthDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

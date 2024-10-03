import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrganizationCreateDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    logoUrl: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsOptional()
    @IsEmail()
    gmail?: string;

    @IsOptional()
    @IsString()
    facebook?: string;

    @IsOptional()
    @IsString()
    zalo?: string;

    @IsOptional()
    @IsString()
    @IsString()
    instagram?: string;
}

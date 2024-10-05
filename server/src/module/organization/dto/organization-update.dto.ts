import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class OrganizationUpdateDto {
    @IsNotEmpty()
    @IsUUID('all')
    organizationId: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsUUID('all')
    logoId?: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;

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
    instagram?: string;
}

export class OrganizationShowDto {
    @IsNotEmpty()
    @IsUUID('all')
    organizationId: string;

    @IsNotEmpty()
    @IsBoolean()
    show: boolean;
}

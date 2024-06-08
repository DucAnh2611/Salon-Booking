import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    deletable: boolean;

    @IsNotEmpty()
    @IsNumber()
    level: number;
}

export class AddNewRoleDto {
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsPositive()
    @IsInt()
    level: number;

    @IsOptional()
    @IsString()
    description: string;
}

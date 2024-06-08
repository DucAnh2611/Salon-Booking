import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsPositive()
    @IsInt()
    level?: number;

    @IsOptional()
    @IsString()
    description?: string;
}

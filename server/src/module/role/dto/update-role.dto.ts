import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsUUID('all', { each: true })
    permissions?: string[];
}

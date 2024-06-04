import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    title?: string;
}

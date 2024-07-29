import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRoleDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsUUID('all')
    parentId: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsUUID('all', { each: true })
    permissionIds: string[];
}

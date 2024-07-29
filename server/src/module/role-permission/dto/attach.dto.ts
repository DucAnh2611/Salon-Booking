import { IsNotEmpty, IsUUID } from 'class-validator';

export class AttachPermissionDto {
    @IsNotEmpty()
    @IsUUID()
    roleId: string;

    @IsNotEmpty()
    @IsUUID('all', { each: true })
    permissionIds: string[];
}

export class CreateRolePermisisonDto {
    @IsNotEmpty()
    @IsUUID('all')
    roleId: string;

    @IsNotEmpty()
    @IsUUID('all', { each: true })
    permissionIds: string[];

    @IsNotEmpty()
    @IsUUID('all')
    userId: string;
}

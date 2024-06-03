import { IsNotEmpty, IsUUID } from 'class-validator';

export class AttachPermissionDto {
    @IsNotEmpty()
    @IsUUID()
    roleId: string;

    @IsNotEmpty()
    @IsUUID('all', { each: true })
    permissionIds: string[];
}

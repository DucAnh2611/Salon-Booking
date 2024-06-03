import { IsNotEmpty, IsUUID } from 'class-validator';
import { PermissionTargetEnum } from '../../../common/enum/permission.enum';

export type GetPermissionTargetDto = {
    roleId: string;
    target: PermissionTargetEnum;
};

export class GetOneRolePermissionDto {
    @IsNotEmpty()
    @IsUUID('all')
    roleId: string;
}

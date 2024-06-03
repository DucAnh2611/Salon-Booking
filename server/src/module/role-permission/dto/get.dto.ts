import { PermissionTargetEnum } from '../../../common/enum/permission.enum';

export type GetPermissionTargetDto = {
    roleId: string;
    target: PermissionTargetEnum;
};

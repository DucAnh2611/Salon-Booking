import { PermissionActionEnum, PermissionTargetEnum } from '../../../enum/permission.enum';

export class CreatePermissionDto {
    action: PermissionActionEnum;
    target: PermissionTargetEnum;
}
